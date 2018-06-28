package com.capitalone.dashboard.collector;

import com.capitalone.dashboard.misc.HygieiaException;
import com.capitalone.dashboard.model.ChangeOrder;
import com.capitalone.dashboard.model.Cmdb;
import com.capitalone.dashboard.model.HpsmSoapModel;
import com.capitalone.dashboard.model.Incident;
import com.capitalone.dashboard.util.HpsmCollectorConstants;
import com.capitalone.dashboard.util.XmlUtil;
import com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl;
import org.apache.commons.httpclient.Credentials;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;
import org.xml.sax.SAXException;


import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPBodyElement;
import javax.xml.soap.SOAPException;

import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.Calendar;


/**
 * HpsmClient implementation that uses SVNKit to fetch information about
 * Subversion repositories.
 */

@Component
public class DefaultHpsmClient implements HpsmClient {

    private static final Log LOG = LogFactory.getLog(DefaultHpsmClient.class);
	private final HpsmSettings hpsmSettings;

    private PostMethod post;
    private SimpleHttpConnectionManager manager = new SimpleHttpConnectionManager(true);
    HttpClient httpclient = new HttpClient(manager);
    boolean usedClient = false;
    int port;

    String strURL;
    String protocol;
    String server;
    String resource;
    String contentType;
    String charset;
    String userName = "";
    String password = "";

    private static final String APP_TYPE = "app";
	private static final String COMPONENT_TYPE = "component";
	private static final String ENVIRONMENT_TYPE = "environment";

	private static final String DEFAULT_CHANGE_QUERY_FORMAT = "(date.entered > ''{0}'' and date.entered < ''{1}'') or (close.time > ''{0}'' and close.time < ''{1}'')";
	private static final String DEFAULT_INCIDENT_QUERY_FORMAT = "(Severity=1 or Severity=2 or Severity=3 or Severity=4) and update.time > ''{0}'' and update.time < ''{1}''";

	private static final String QUERY_DATE_FORMAT = "MM/dd/yyyy HH:mm:ss";

	public static final int MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

	private long lastExecuted;
	private long incidentCount;
	private long changeCount;

	private enum SoapRequestType {
		CMDB, CHANGE_ORDER, INCIDENT
	}

	@Override
	public void setLastExecuted(long lastExecuted) { this.lastExecuted = lastExecuted; };

	@Override
	public long getLastExecuted() { return lastExecuted; };

	@Override
	public long getIncidentCount() { return incidentCount; }

	@Override
	public void setIncidentCount(long incidentCount) { this.incidentCount = incidentCount; }

	@Override
	public long getChangeCount() { return changeCount; }

	@Override
	public void setChangeCount(long changeCount) { this.changeCount = changeCount; }

	@Autowired
	public DefaultHpsmClient(HpsmSettings hpsmSettings) {
		this.hpsmSettings = hpsmSettings;
	}

    /**
     *
     * @return Combined List<Cmdb> of APPs and Components
     */
	@Override
	public List<Cmdb> getApps() throws HygieiaException {

		String limit = hpsmSettings.getCmdbBatchLimit();
		if(limit != null && !limit.isEmpty()) {
			LOG.info("NOTE: Collector run limited to " + limit + " results by property file setting.");
		}
		List<Cmdb> cmdbList = new ArrayList<>();

		String statusString = hpsmSettings.getAppStatus();
		String[] statusArray = (statusString == null || statusString.isEmpty()) ? new String[]{null} : statusString.split(",");

		for(int i = 0; i < statusArray.length; i++) {
			if(statusArray[i] != null) {
				// this is just for logging what we are doing - it is perfectly valid for this to be null, but will
				// only run once - additional logging is unnecessary.
				LOG.info("Retrieving for status: " + statusArray[i]);
			}
			cmdbList.addAll(getAppList(statusArray[i]));
			cmdbList.addAll(getComponentList(statusArray[i]));
			cmdbList.addAll(getEnvironmentList(statusArray[i]));
		}

		return cmdbList;
	}

	@Override
	public List<ChangeOrder> getChangeOrders() throws HygieiaException{
		List<ChangeOrder> changeOrderList;
		changeOrderList = getChangeOrderList();
		return changeOrderList;
	}

	@Override
	public List<Incident> getIncidents() throws HygieiaException{
		List<Incident> incidentList;
		incidentList = getIncidentList();
		return incidentList;
	}

	/**
	 *
	 * Returns List<Cmdb> of Apps
	 * @return List<Cmdb>
	 */
	private List<Cmdb> getAppList(String status) throws HygieiaException{
		List<Cmdb> appList;

		HpsmSoapModel hpsmSoapModel = new HpsmSoapModel();
        hpsmSoapModel.setItemSubType(hpsmSettings.getAppSubType());
        hpsmSoapModel.setRequestTypeName(hpsmSettings.getDetailsRequestType());
        hpsmSoapModel.setSoapAction(hpsmSettings.getDetailsSoapAction());
        hpsmSoapModel.setStatus(status);

		appList = getConfigurationItemList(hpsmSoapModel);

		return appList;
	}

	/**
	 *
	 * @return  Returns List<Cmdb> of Components
	 */
	private List<Cmdb> getComponentList(String status) throws HygieiaException{
		List<Cmdb> componentList;
        HpsmSoapModel hpsmSoapModel = new HpsmSoapModel();

		hpsmSoapModel.setItemSubType(hpsmSettings.getCompSubType());
        hpsmSoapModel.setItemType(hpsmSettings.getCompType());
        hpsmSoapModel.setSoapAction(hpsmSettings.getDetailsSoapAction());
        hpsmSoapModel.setRequestTypeName(hpsmSettings.getDetailsRequestType());
        hpsmSoapModel.setStatus(status);

		componentList = getConfigurationItemList(hpsmSoapModel);

        return componentList;
	}

	/**
	 *
	 * Returns List<Cmdb> of Environments
	 * @return List<Cmdb>
	 */
	private List<Cmdb> getEnvironmentList(String status) throws HygieiaException{
		List<Cmdb> componentList;
		HpsmSoapModel hpsmSoapModel = new HpsmSoapModel();

		hpsmSoapModel.setItemSubType(hpsmSettings.getEnvSubType());
		hpsmSoapModel.setItemType(hpsmSettings.getEnvType());
		hpsmSoapModel.setSoapAction(hpsmSettings.getDetailsSoapAction());
		hpsmSoapModel.setRequestTypeName(hpsmSettings.getDetailsRequestType());
		hpsmSoapModel.setStatus(status);

		componentList = getConfigurationItemList(hpsmSoapModel);

		return componentList;
	}


	/**
	 * Takes hpsmSoapModel with settings set. Makes SOAP call and returns  List <Cmdb> with details
	 * @param hpsmSoapModel
	 * @return
	 */
	private List<Cmdb> getConfigurationItemList(HpsmSoapModel hpsmSoapModel) throws  HygieiaException{
		List<Cmdb> configurationItemList = new ArrayList<>();

		boolean getMore = true;
		int startValue = 0;
		while(getMore){

			String batchLimit = hpsmSettings.getCmdbBatchLimit();
			int returnLimit = Integer.parseInt(batchLimit);


			String newStart = Integer.toString(startValue);
			String soapString = getSoapMessage(hpsmSoapModel,newStart, batchLimit, SoapRequestType.CMDB);
			String response = makeSoapCall(soapString, hpsmSoapModel);

			Document doc = responseToDoc(response);
			NodeList responseNodeList = doc.getElementsByTagName("RetrieveDeviceListResponse");

			String more = "";
			String status = "";
			for (int i = 0; i < responseNodeList.getLength(); i++) {
				NamedNodeMap instanceChildNodes = responseNodeList.item(i).getAttributes();
				more = instanceChildNodes.getNamedItem("more").getNodeValue();
				status = instanceChildNodes.getNamedItem("status").getNodeValue();

			}

			configurationItemList.addAll(documentToCmdbDetailsList(doc));

			if(more == null || !more.equals("1") || status == null || !status.equals("SUCCESS")){
				getMore = false;
				LOG.info("No more items retrieved. Item count " + configurationItemList.size());
			}
			startValue += returnLimit;
		}

		return configurationItemList;
	}

	private List <Cmdb> documentToCmdbDetailsList(Document doc) throws  HygieiaException{
        List <Cmdb> returnList = new ArrayList<>();
		try {
			for(Node n: XmlUtil.asList(doc.getElementsByTagName("instance"))){
				Map xmlMap = XmlUtil.getElementKeyValue(n.getChildNodes());
				returnList.addAll(getCmdbItemFromXmlMap(xmlMap));
			}
		}catch(Exception e){
			LOG.error(e);
		}
		return returnList;
	}

	/**
	 *
	 * Returns List<ChangeOrder> of Change Orders
	 * @return List<ChangeOrder>
	 */
	private List<ChangeOrder> getChangeOrderList() throws HygieiaException{
		List<ChangeOrder> changeOrderList;
		String limit = hpsmSettings.getChangeOrderReturnLimit();

		HpsmSoapModel hpsmSoapModel = new HpsmSoapModel();
		hpsmSoapModel.setRequestTypeName(hpsmSettings.getChangeOrderRequestType());
		hpsmSoapModel.setSoapAction(hpsmSettings.getChangeOrderSoapAction());

		String soapString = getSoapMessage(hpsmSoapModel,"",limit, SoapRequestType.CHANGE_ORDER);

		String response  = makeSoapCall(soapString, hpsmSoapModel);

		changeOrderList = responseToChangeOrderList(response);

		return changeOrderList;
	}
	private List <ChangeOrder> responseToChangeOrderList(String response) {
		List <ChangeOrder> returnList = new ArrayList<>();
		try {

			Document doc = responseToDoc(response);
			for(Node n: XmlUtil.asList(doc.getElementsByTagName("instance"))){
				Map headerMap = XmlUtil.getElementKeyValueByTag(n.getChildNodes(), "header");
				Map instanceMap = XmlUtil.getElementKeyValue(n.getChildNodes());
				if(instanceMap.containsKey(HpsmCollectorConstants.CHANGE_SERVICE)){
					headerMap.put(HpsmCollectorConstants.CHANGE_SERVICE,instanceMap.get(HpsmCollectorConstants.CHANGE_SERVICE));
				}
				if(headerMap != null && !headerMap.isEmpty()){
					returnList.addAll(getChangeFromXmlMap(headerMap));
				}

			}

		}catch(Exception e){
			LOG.error(e);
		}

		return returnList;
	}

	/**
	 *
	 * Returns List<Incident> of Incidents
	 * @return List<Incident>
	 */
	private List<Incident> getIncidentList() throws HygieiaException{
		List<Incident> incidentList;
		String limit = hpsmSettings.getIncidentReturnLimit();

		HpsmSoapModel hpsmSoapModel = new HpsmSoapModel();
		hpsmSoapModel.setRequestTypeName(hpsmSettings.getIncidentRequestType());
		hpsmSoapModel.setSoapAction(hpsmSettings.getIncidentSoapAction());

		String soapString = getSoapMessage(hpsmSoapModel, "", limit, SoapRequestType.INCIDENT );

		String response  = makeSoapCall(soapString, hpsmSoapModel);

		incidentList = responseToIncidentList(response);

		return incidentList;
	}
	private List <Incident> responseToIncidentList(String response) {
		List <Incident> returnList = new ArrayList<>();
		try {
			Document doc = responseToDoc(response);
			for(Node n: XmlUtil.asList(doc.getElementsByTagName("instance"))){
				Map xmlMap = XmlUtil.getElementKeyValue(n.getChildNodes());
				returnList.addAll(getIncidentFromXmlMap(xmlMap));
			}
		}catch(Exception e){
			LOG.error(e);
		}
		return returnList;
	}

	/**
	 * Returns the type of the configuration item.
	 * @param cmdb
	 * @return the type of the configuration item.
	 */
	private String getItemType(Cmdb cmdb) {
		String itemType = null;
		String subType = cmdb.getConfigurationItemSubType();
		String type = cmdb.getConfigurationItemType();

		String hpsmSettingsSubType = hpsmSettings.getAppSubType();
		String hpsmSettingsType = hpsmSettings.getAppType();

		boolean typeCheck = false;
		boolean subTypeCheck = false;

		if(!"".equals(hpsmSettingsType)){
			typeCheck = true;
		}
		if(!"".equals(hpsmSettingsSubType)){
			subTypeCheck = true;
		}

		if(!typeCheck && subTypeCheck){
			if(subType != null && subType.equals(hpsmSettings.getAppSubType())){
				itemType = APP_TYPE;
			}
			else if(subType != null && subType.equals(hpsmSettings.getCompSubType())){
				itemType = COMPONENT_TYPE;
			}
			else if(subType != null && subType.equals(hpsmSettings.getEnvSubType())) {
				itemType = ENVIRONMENT_TYPE;
			}
		}else if(typeCheck && !subTypeCheck){
			if(type != null && type.equals(hpsmSettings.getAppType())){
				itemType = APP_TYPE;
			}
			else if(type != null && type.equals(hpsmSettings.getCompType())){
				itemType = COMPONENT_TYPE;
			}
			else if(type != null && type.equals(hpsmSettings.getEnvType())) {
				itemType = ENVIRONMENT_TYPE;
			}
		}else{
			if(subType != null && subType.equals(hpsmSettings.getAppSubType()) && type != null && type.equals(hpsmSettings.getAppType())){
				itemType = APP_TYPE;
			}
			else if(subType != null && subType.equals(hpsmSettings.getCompSubType()) && type != null && type.equals(hpsmSettings.getCompType())){
				itemType = COMPONENT_TYPE;
			}
			else if(subType != null && subType.equals(hpsmSettings.getEnvSubType()) && type != null && type.equals(hpsmSettings.getEnvType())){
				itemType = ENVIRONMENT_TYPE;
			}

		}

		return itemType;
	}
	/**
	 *  Converts String response into document for parsing
	 * @param response SOAP response required for creation of Document
	 * @return Document Object
	 */
	private Document responseToDoc(String response){

		Document doc = null;

		try {

			DocumentBuilderFactory factory = new DocumentBuilderFactoryImpl();
			DocumentBuilderFactory.newInstance();
			DocumentBuilder builder =  factory.newDocumentBuilder();
			ByteArrayInputStream input =  new ByteArrayInputStream(response.getBytes("UTF-8"));
			doc = builder.parse(input);

		} catch (ParserConfigurationException e) {
			LOG.error("ParserConfigurationException", e);
		} catch (UnsupportedEncodingException e) {
			LOG.error("UnsupportedEncodingException", e);
		} catch (IOException e) {
			LOG.error("IOException", e);
		} catch (SAXException e) {
			LOG.error("SAXException", e);
		}


		return doc;
	}

	/**
	 *  Start SOAP connection
	 */
	private void startHttpConnection(){
		server = hpsmSettings.getServer();
		port = hpsmSettings.getPort();
		protocol = hpsmSettings.getProtocol() + "://";
		resource = hpsmSettings.getResource();
		userName = hpsmSettings.getUser();
		password = hpsmSettings.getPass();

		if(!usedClient){
			strURL = protocol + server + ":" + port + "/"
					+ resource;
			// Prepare HTTP post
			post = new PostMethod(strURL);


			// Get HTTP client
			httpclient.getParams().setAuthenticationPreemptive(true);

			Credentials defaultcreds = new UsernamePasswordCredentials(userName,
					password);
			httpclient.getState().setCredentials(
					new AuthScope(server, port, AuthScope.ANY_REALM), defaultcreds);
			usedClient = true;
		}

	}

    /**
     * Ends SOAP Connection
     */
	private void stopHttpConnection() {
		if(post != null && usedClient){
			post.releaseConnection();
		}
		if(manager != null && usedClient){
			manager.shutdown();
		}
		usedClient = false;
	}
	private String getResponseString(InputStream in) throws IOException {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		byte[] byteArray = new byte[1024];
		int count;
		while ((count = in.read(byteArray, 0, byteArray.length)) > 0) {
			outputStream.write(byteArray, 0, count);
		}
		return new String(outputStream.toByteArray(), "UTF-8");
	}
    /**
     *  Makes SOAP request for given soap message
     * @param soapMessageString Generated SOAP ready for POST
     * @param hpsmSoapModel hpsmSoapModel
     * @return Soap response
     */
    private String makeSoapCall(String soapMessageString, HpsmSoapModel hpsmSoapModel) throws HygieiaException{

        String requestAction = hpsmSoapModel.getSoapAction();
        String response = "";
        contentType = hpsmSettings.getContentType();
        charset = hpsmSettings.getCharset();

        try {
            startHttpConnection();

            RequestEntity entity = new StringRequestEntity(
                    soapMessageString, contentType, charset);
            post.setRequestEntity(entity);

            post.setRequestHeader("SOAPAction", requestAction);

            httpclient.executeMethod(post);

            response = getResponseString(post.getResponseBodyAsStream());

            if(!"OK".equals(post.getStatusText())){
                throw new HygieiaException("Soap Request Failure: " +  post.getStatusCode() + "|response: " +response, HygieiaException.BAD_DATA);
            }

            stopHttpConnection();
        } catch (IOException e) {
            LOG.error("Error while trying to make soap call: " + e);
        }
        return response;

    }

	private String getSoapMessage(HpsmSoapModel hpsmSoapModel, String start, String limit, SoapRequestType type){
		String strMsg = "";
		SOAPMessage soapMsg;
		String requestTypeName = hpsmSoapModel.getRequestTypeName();

		try {
			MessageFactory factory = MessageFactory.newInstance();

			soapMsg = factory.createMessage();

			SOAPPart part = soapMsg.getSOAPPart();

			SOAPEnvelope envelope = part.getEnvelope();
			envelope.addNamespaceDeclaration("ns", "http://schemas.hp.com/SM/7");
			envelope.addNamespaceDeclaration("com", "http://schemas.hp.com/SM/7/Common");
			envelope.addNamespaceDeclaration("xm", "http://www.w3.org/2005/05/xmlmime");

			SOAPBody body = envelope.getBody();

			SOAPBodyElement requestType = body.addBodyElement(envelope.createName(requestTypeName,"ns", ""));

			if(limit != null && !limit.isEmpty()) {
				QName name1 = new QName("count");
				requestType.addAttribute(name1, limit);
			}
			if(start != null && !start.isEmpty()) {
				QName qNameStart = new QName("start");
				requestType.addAttribute(qNameStart, start);
			}
			QName qNameIgnoreEmptyValues = new QName("ignoreEmptyElements");
			requestType.addAttribute(qNameIgnoreEmptyValues, "true");

			SOAPBodyElement modelTag = body.addBodyElement(envelope.createName("model","ns", ""));

			SOAPBodyElement keysTag = body.addBodyElement(envelope.createName("keys","ns", ""));

			// creates instance tag
			body.addBodyElement(envelope.createName("instance", "ns", ""));

			if(type.equals(SoapRequestType.CHANGE_ORDER)){
				handleChangeSoapMessage(keysTag);
			}else if(type.equals(SoapRequestType.INCIDENT)){
				handleIncidentSoapMessage(keysTag);
			}else{
				handleCmdbSoapMessage(hpsmSoapModel, envelope, keysTag);
			}

			modelTag.addChildElement(keysTag);

			requestType.addChildElement(modelTag);

			ByteArrayOutputStream out = new ByteArrayOutputStream();
			soapMsg.writeTo(out);
			strMsg = new String(out.toByteArray());

		} catch (SOAPException e) {
			LOG.error("SOAPException: " + e);
		} catch (UnsupportedEncodingException e) {
			LOG.error("UnsupportedEncodingException: " + e);
		} catch (IOException e) {
			LOG.error("IOException: " + e);
		}

		return strMsg;
	}

    private void handleCmdbSoapMessage(HpsmSoapModel hpsmSoapModel, SOAPEnvelope envelope, SOAPBodyElement keysTag) throws SOAPException{

		String itemType = hpsmSoapModel.getItemType();
		String itemSubType = hpsmSoapModel.getItemSubType();
		String item = hpsmSoapModel.getItem();
		String status = hpsmSoapModel.getStatus();

		SOAPBody body = envelope.getBody();

		if (itemType != null && !itemType.isEmpty()) {

			SOAPBodyElement configItemType = body.addBodyElement(envelope.createName("ConfigurationItemType", "ns", ""));
			configItemType.addTextNode(itemType);
			keysTag.addChildElement(configItemType);

		}
		if (itemSubType != null && !itemSubType.isEmpty()) {

			SOAPBodyElement configItemSubType = body.addBodyElement(envelope.createName("ConfigurationItemSubType", "ns", ""));
			configItemSubType.addTextNode(itemSubType);
			keysTag.addChildElement(configItemSubType);

		}
		if (item != null && !item.isEmpty()) {

			SOAPBodyElement configItem = body.addBodyElement(envelope.createName("ConfigurationItem", "ns", ""));
			configItem.addTextNode(item);
			keysTag.addChildElement(configItem);

		}
		if (status != null && !status.isEmpty()) {

			SOAPBodyElement configItemStatus = body.addBodyElement(envelope.createName("Status", "ns", ""));
			configItemStatus.addTextNode(status);
			keysTag.addChildElement(configItemStatus);

		}
	}


	private void handleIncidentSoapMessage(SOAPBodyElement keysTag) throws SOAPException{

		QName query = new QName("query");

		// Incidents can be queried based on time.  This code retrieves the incidents since
		// the last time it was run.  If that time cannot be determined, it counts backwards
		// the number of days specified in hpsm.properties and retrieves those incidents.

		// Get current date/time
		Date nowDate = new Date();

		// Get the last time this collector was run
		Date previousDate = new Date(this.lastExecuted);

		// Convert the above times to milliseconds for comparison
		long nowMillis = nowDate.getTime();
		long previousMillis = previousDate.getTime();

		// calculate the difference in days between the two dates by dividing the difference by the number of milliseconds in a day
		int diffInDays = (int) (Math.abs((nowMillis - previousMillis)) / MILLISECONDS_IN_DAY);

		// get the number of days specified in the hpsm.properties file
		int incidentDays = hpsmSettings.getIncidentDays();

		// IF there are no incidents in the collection, or the collection does not exist
		// OR if the times are reversed
		// OR the number of days since collector last ran is greater than the requested number of days
		// THEN the last time the collector ran is irrelevant so use the number of days in hpsm.properties
		if((incidentCount < 1) || (previousMillis > nowMillis) || (diffInDays > incidentDays)){
			Calendar cal = Calendar.getInstance();
			cal.setTime(nowDate);
			cal.add(Calendar.DATE, - incidentDays);
			previousDate = cal.getTime();
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat(QUERY_DATE_FORMAT);
		String now = dateFormat.format(nowDate);
		String previous = dateFormat.format(previousDate);

		String format = hpsmSettings.getIncidentQuery();
		if(format == null || format.isEmpty()){
			format = DEFAULT_INCIDENT_QUERY_FORMAT;
		}

		Object[] args = new Object[]{ previous, now };
		String queryString = MessageFormat.format(format, args);

		keysTag.addAttribute(query,  queryString);

	}

	private void handleChangeSoapMessage(SOAPBodyElement keysTag) throws SOAPException{

		QName query = new QName("query");

		// Changes can be queried based on time.  This code retrieves the changes since
		// the last time it was run.  If that time cannot be determined, it counts backwards
		// the number of days specified in hpsm.properties and retrieves those changes.

		// Get current date/time
		Date nowDate = new Date();

		// Get the last time this collector was run
		Date previousDate = new Date(this.lastExecuted);

		// Convert the above times to milliseconds for comparison
		long nowMillis = nowDate.getTime();
		long previousMillis = previousDate.getTime();

		// calculate the difference in days between the two dates by dividing the difference by the number of milliseconds in a day
		int diffInDays = (int) (Math.abs((nowMillis - previousMillis)) / MILLISECONDS_IN_DAY);

		// get the number of days specified in the hpsm.properties file
		int changeDays = hpsmSettings.getChangeOrderDays();

		// IF there are no changess in the collection, or the collection does not exist
		// OR if the times are reversed
		// OR the number of days since collector last ran is greater than the requested number of days
		// THEN the last time the collector ran is irrelevant so use the number of days in hpsm.properties
		if((changeCount < 1) || (previousMillis > nowMillis) || (diffInDays > changeDays)){
			Calendar cal = Calendar.getInstance();
			cal.setTime(nowDate);
			cal.add(Calendar.DATE, - changeDays);
			previousDate = cal.getTime();
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat(QUERY_DATE_FORMAT);
		String now = dateFormat.format(nowDate);
		String previous = dateFormat.format(previousDate);

		String format = hpsmSettings.getChangeOrderQuery();
		if(format == null || format.isEmpty()){
			format = DEFAULT_CHANGE_QUERY_FORMAT;
		}

		Object[] args = new Object[]{ previous, now };
		String queryString = MessageFormat.format(format, args);

		keysTag.addAttribute(query,  queryString);

	}
	private List<Cmdb> getCmdbItemFromXmlMap(Map map) {
		if(map == null || map.isEmpty()) return new ArrayList<>();
		if(getStringValueFromMap(map,HpsmCollectorConstants.CONFIGURATION_ITEM).isEmpty()) return new ArrayList<>();

		Cmdb cmdb = new Cmdb();

		cmdb.setConfigurationItem(getStringValueFromMap(map,HpsmCollectorConstants.CONFIGURATION_ITEM));
		cmdb.setConfigurationItemSubType(getStringValueFromMap(map,HpsmCollectorConstants.CONFIGURATION_ITEM_SUBTYPE));
		cmdb.setConfigurationItemType(getStringValueFromMap(map,HpsmCollectorConstants.CONFIGURATION_ITEM_TYPE));
		cmdb.setCommonName(getStringValueFromMap(map,HpsmCollectorConstants.COMMON_NAME));
		cmdb.setAssignmentGroup(getStringValueFromMap(map,HpsmCollectorConstants.ASSIGNMENT_GROUP));
		cmdb.setOwnerDept(getStringValueFromMap(map,HpsmCollectorConstants.OWNER_DEPT));
		cmdb.setAppServiceOwner(getStringValueFromMap(map,HpsmCollectorConstants.APP_SERVICE_OWNER));
		cmdb.setBusinessOwner(getStringValueFromMap(map,HpsmCollectorConstants.BUSINESS_OWNER));
		cmdb.setSupportOwner(getStringValueFromMap(map,HpsmCollectorConstants.SUPPORT_OWNER));
		cmdb.setDevelopmentOwner(getStringValueFromMap(map,HpsmCollectorConstants.DEVELOPMENT_OWNER));
		cmdb.setItemType(getItemType(cmdb));
		cmdb.setValidConfigItem(true);
		cmdb.setTimestamp(System.currentTimeMillis());

		List<Cmdb> list = new ArrayList<>();
		list.add(cmdb);
		return list;
	}
	private List<Incident> getIncidentFromXmlMap(Map map) {
		if(map == null || map.isEmpty()) return new ArrayList<>();
		if(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_ID).isEmpty()) return new ArrayList<>();

		Incident incident = new Incident();
		incident.setIncidentID(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_ID));
		incident.setCategory(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_CATEGORY));
		incident.setOpenTime(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_OPEN_TIME));
		String closedTime = getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_CLOSE_TIME);
		if (!StringUtils.isEmpty(closedTime)) {
			incident.setClosedTime(closedTime);
		} else {
			incident.setClosedTime(0L);
		}
		incident.setOpenedBy(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_OPEN_BY));
		incident.setUpdatedTime(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_UPDATE_TIME));
		incident.setSeverity(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_SEVERITY));
		incident.setPrimaryAssignmentGroup(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_PRIMARY_ASSIGNMENT_GROUP));
		incident.setStatus(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_STATUS));
		incident.setAffectedItem(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_AFFECTED_ITEM));
		incident.setIncidentDescription(getStringValueFromMap(map,HpsmCollectorConstants.INCIDENT_DESCRIPTION));

		List<Incident> list = new ArrayList<>();
		list.add(incident);
		return list;
	}
	private List<ChangeOrder> getChangeFromXmlMap(Map map) {
		if(map == null || map.isEmpty()) return new ArrayList<>();
		if(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_ID).isEmpty()) return new ArrayList<>();

		ChangeOrder change = new ChangeOrder();
		change.setChangeID(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_ID));
		change.setCategory(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_CATEGORY));
		change.setStatus(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_STATUS));
		change.setApprovalStatus(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_APPROVAL_STATUS));
		change.setInitiatedBy(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_INITIATED_BY));
		change.setAssignedTo(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_ASSIGNED_TO));
		change.setAssignmentGroup(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_ASSIGNMENT_GROUP));
		change.setPlannedStart(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_PLANNED_START));
		change.setPlannedEnd(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_PLANNED_END));
		change.setReason(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_REASON));
		change.setPhase(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_PHASE));
		change.setRiskAssessment(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_RISK_ASSESSMENT));
		change.setDateEntered(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_DATE_ENTERED));
		change.setOpen(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_OPEN));
		change.setTitle(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_TITLE));
		change.setSubcategory(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_SUBCATEGORY));
		change.setChangeModel(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_MODEL));
		change.setService(getStringValueFromMap(map,HpsmCollectorConstants.CHANGE_SERVICE));
		List<ChangeOrder> list = new ArrayList<>();
		list.add(change);
		return list;
	}
	private String getStringValueFromMap(Map map, String key){
		if(!map.containsKey(key)
				|| map.get(key) == null
				|| "".equals(key)) return "";
		return map.get(key).toString();
	}
}
