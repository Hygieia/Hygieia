package com.capitalone.dashboard.service;

import static com.capitalone.dashboard.service.DeployServiceImpl.RundeckXMLParser.getAttributeValue;
import static com.capitalone.dashboard.service.DeployServiceImpl.RundeckXMLParser.getChildNodeAttribute;
import static com.capitalone.dashboard.service.DeployServiceImpl.RundeckXMLParser.getChildNodeValue;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
//import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.capitalone.dashboard.misc.HygieiaException;
import com.capitalone.dashboard.model.Collector;
import com.capitalone.dashboard.model.CollectorItem;
import com.capitalone.dashboard.model.CollectorType;
import com.capitalone.dashboard.model.Component;
import com.capitalone.dashboard.model.DataResponse;
import com.capitalone.dashboard.model.EnvironmentComponent;
import com.capitalone.dashboard.model.EnvironmentStatus;
import com.capitalone.dashboard.model.deploy.DeployableUnit;
import com.capitalone.dashboard.model.deploy.Environment;
import com.capitalone.dashboard.model.deploy.Server;
import com.capitalone.dashboard.repository.CollectorItemRepository;
import com.capitalone.dashboard.repository.CollectorRepository;
import com.capitalone.dashboard.repository.ComponentRepository;
import com.capitalone.dashboard.repository.EnvironmentComponentRepository;
import com.capitalone.dashboard.repository.EnvironmentStatusRepository;
import com.capitalone.dashboard.request.CollectorRequest;
import com.capitalone.dashboard.request.DeployDataCreateRequest;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;

@Service
public class DeployServiceImpl implements DeployService {
    
    private static final Pattern INSTANCE_URL_PATTERN = Pattern.compile("https?:\\/\\/[^\\/]*");

    private final ComponentRepository componentRepository;
    private final EnvironmentComponentRepository environmentComponentRepository;
    private final EnvironmentStatusRepository environmentStatusRepository;
    private final CollectorRepository collectorRepository;
    private final CollectorItemRepository collectorItemRepository;
    private final CollectorService collectorService;

    @Autowired
    public DeployServiceImpl(ComponentRepository componentRepository,
                             EnvironmentComponentRepository environmentComponentRepository,
                             EnvironmentStatusRepository environmentStatusRepository,
                             CollectorRepository collectorRepository, CollectorItemRepository collectorItemRepository, CollectorService collectorService) {
        this.componentRepository = componentRepository;
        this.environmentComponentRepository = environmentComponentRepository;
        this.environmentStatusRepository = environmentStatusRepository;
        this.collectorRepository = collectorRepository;
        this.collectorItemRepository = collectorItemRepository;
        this.collectorService = collectorService;
    }

    @Override
    public DataResponse<List<Environment>> getDeployStatus(ObjectId componentId) {
        Component component = componentRepository.findOne(componentId);
        
        Collection<CollectorItem> cis = component.getCollectorItems()
                .get(CollectorType.Deployment);
        
        return getDeployStatus(cis);
    }
    
    private DataResponse<List<Environment>> getDeployStatus(Collection<CollectorItem> deployCollectorItems) {
    	List<Environment> environments = new ArrayList<>();
    	long lastExecuted = 0;
    	
        if (deployCollectorItems == null) {
            return new DataResponse<>(environments, 0);
        }
        
        // We will assume that if the component has multiple deployment collectors
        // then each collector will have a different url which means each Environment will be different
        for (CollectorItem item : deployCollectorItems) {
	        ObjectId collectorItemId = item.getId();
	
	        List<EnvironmentComponent> components = environmentComponentRepository
	                .findByCollectorItemId(collectorItemId);
	        List<EnvironmentStatus> statuses = environmentStatusRepository
	                .findByCollectorItemId(collectorItemId);
	
	        for (Map.Entry<Environment, List<EnvironmentComponent>> entry : groupByEnvironment(
	                components).entrySet()) {
	            Environment env = entry.getKey();
	            environments.add(env);
	            for (EnvironmentComponent envComponent : entry.getValue()) {
	                env.getUnits().add(
	                        new DeployableUnit(envComponent, servers(envComponent,
	                                statuses)));
	            }
	        }
	
	        Collector collector = collectorRepository
	                .findOne(item.getCollectorId());
	        
	        if (collector.getLastExecuted() > lastExecuted) {
	        	lastExecuted = collector.getLastExecuted();
	        }
        }
        return new DataResponse<>(environments, lastExecuted);
    }

    private Map<Environment, List<EnvironmentComponent>> groupByEnvironment(
            List<EnvironmentComponent> components) {
        Map<Environment, Map<String, EnvironmentComponent>> trackingMap = new LinkedHashMap<>();
        for (EnvironmentComponent component : components) {
            Environment env = new Environment(component.getEnvironmentName(),
                    component.getEnvironmentUrl());
            
            if (!trackingMap.containsKey(env)) {
                trackingMap.put(env, new LinkedHashMap<>());
            }
            //two conditions to overwrite the value for the specific component
            if (trackingMap.get(env).get(component.getComponentName()) == null ||
            		component.getAsOfDate() > trackingMap.get(env)
            		.get(component.getComponentName()).getAsOfDate()) {
            	trackingMap.get(env).put(component.getComponentName(), component);
            }
        }
        
        //flatten the deeper map into a list
        return trackingMap.entrySet().stream()
        	.map(e -> new AbstractMap.SimpleEntry<>(e.getKey(), 
        			e.getValue().entrySet().stream().map(ec -> ec.getValue()).collect(Collectors.toList())))
        	.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private Iterable<Server> servers(final EnvironmentComponent component,
                                     List<EnvironmentStatus> statuses) {
        return Iterables.transform(
                Iterables.filter(statuses, new ComponentMatches(component)),
                new ToServer());
    }

    private class ComponentMatches implements Predicate<EnvironmentStatus> {
        private EnvironmentComponent component;

        public ComponentMatches(EnvironmentComponent component) {
            this.component = component;
        }

        @Override
        public boolean apply(EnvironmentStatus environmentStatus) {
            return environmentStatus.getEnvironmentName().equals(
                    component.getEnvironmentName())
                    && environmentStatus.getComponentName().equals(
                    component.getComponentName());
        }
    }

    private class ToServer implements com.google.common.base.Function<EnvironmentStatus, Server> {
        @Override
        public Server apply(EnvironmentStatus status) {
            return new Server(status.getResourceName(), status.isOnline());
        }
    }


    @Override
    public String create(DeployDataCreateRequest request) throws HygieiaException {
        /**
         * Step 1: create Collector if not there
         * Step 2: create Collector item if not there
         * Step 3: Insert build data if new. If existing, update it.
         */
        Collector collector = createCollector();

        if (collector == null) {
            throw new HygieiaException("Failed creating Deploy collector.", HygieiaException.COLLECTOR_CREATE_ERROR);
        }

        CollectorItem collectorItem = createCollectorItem(collector, request);

        if (collectorItem == null) {
            throw new HygieiaException("Failed creating Deploy collector item.", HygieiaException.COLLECTOR_ITEM_CREATE_ERROR);
        }

        EnvironmentComponent deploy = createEnvComponent(collectorItem, request);

        if (deploy == null) {
            throw new HygieiaException("Failed inserting/updating Deployment information.", HygieiaException.ERROR_INSERTING_DATA);
        }

        return deploy.getId().toString();

    }

    @Override
    public DataResponse<List<Environment>> getDeployStatus(String applicationName) {
        //FIXME: Remove hardcoding of Jenkins.
        List<Collector> collectorList = collectorRepository.findByCollectorTypeAndName(CollectorType.Deployment, "Jenkins");
        if (CollectionUtils.isEmpty(collectorList)) return new DataResponse<>(null, 0);

        Collector collector = collectorList.get(0);
        List<CollectorItem> cis = collectorItemRepository.findByOptionsAndDeployedApplicationName(collector.getId(), applicationName);

        return getDeployStatus(cis);
    }

    private Collector createCollector() {
        CollectorRequest collectorReq = new CollectorRequest();
        collectorReq.setName("Jenkins");  //for now hardcode it.
        collectorReq.setCollectorType(CollectorType.Deployment);
        Collector col = collectorReq.toCollector();
        col.setEnabled(true);
        col.setOnline(true);
        col.setLastExecuted(System.currentTimeMillis());
        return collectorService.createCollector(col);
    }

    private CollectorItem createCollectorItem(Collector collector, DeployDataCreateRequest request) {
        CollectorItem tempCi = new CollectorItem();
        tempCi.setCollectorId(collector.getId());
        tempCi.setDescription(request.getAppName());
        tempCi.setPushed(true);
        tempCi.setLastUpdated(System.currentTimeMillis());
        tempCi.setNiceName(request.getNiceName());
        Map<String, Object> option = new HashMap<>();
        option.put("applicationName", request.getAppName());
        option.put("instanceUrl", request.getInstanceUrl());
        tempCi.getOptions().putAll(option);

        CollectorItem collectorItem = collectorService.createCollectorItem(tempCi);
        return collectorItem;
    }

    private EnvironmentComponent createEnvComponent(CollectorItem collectorItem, DeployDataCreateRequest request) {
        EnvironmentComponent deploy = environmentComponentRepository.
                findByUniqueKey(collectorItem.getId(), request.getArtifactName(), request.getArtifactName(), request.getEndTime());
        if ( deploy == null) {
            deploy = new EnvironmentComponent();
        }

        deploy.setAsOfDate(System.currentTimeMillis());
        deploy.setCollectorItemId(collectorItem.getId());
        deploy.setComponentID(request.getArtifactGroup());
        deploy.setComponentName(request.getArtifactName());
        deploy.setComponentVersion(request.getArtifactVersion());
        deploy.setEnvironmentName(request.getEnvName());
        deploy.setEnvironmentUrl(request.getInstanceUrl());
        deploy.setJobUrl(request.getJobUrl());
        deploy.setDeployTime(request.getEndTime());
        deploy.setDeployed("SUCCESS".equalsIgnoreCase(request.getDeployStatus()));

        return environmentComponentRepository.save(deploy); // Save = Update (if ID present) or Insert (if ID not there)
    }

    @Override
    public String createRundeckBuild(Document doc, String executionId, String status) throws HygieiaException {
        Node executionNode = doc.getElementsByTagName("execution").item(0);
        Node jobNode = executionNode.getFirstChild();
        RundeckXMLParser p = new RundeckXMLParser(doc);
        DeployDataCreateRequest request = new DeployDataCreateRequest();
        request.setExecutionId(executionId);
        request.setDeployStatus(status.toUpperCase());
        request.setAppName(getAttributeValue(executionNode, "project"));
        request.setArtifactGroup(p.findMatchingOption("artifactGroup", "group", "hygieiaArtifactGroup"));
        request.setArtifactName(p.findMatchingOption("artifactId", "artifactName"));
        request.setArtifactVersion(p.findMatchingOption("version", "artifactVersion"));
        request.setEnvName(p.findMatchingOption("environment", "env", "executionEnvironment", "hygieiaEnv"));
        request.setNiceName(p.findMatchingOption("niceName", "hygieiaNiceName"));
        request.setStartedBy(getChildNodeValue(executionNode, "user"));
        request.setStartTime(Long.valueOf(getChildNodeAttribute(executionNode, "date-started", "unixtime")));
        request.setEndTime(Long.valueOf(getChildNodeAttribute(executionNode, "date-ended", "unixtime")));
        request.setDuration(request.getEndTime() - request.getStartTime());
        request.setJobName(RundeckXMLParser.getAttributeValue(executionNode, "href"));
        Matcher matcher = INSTANCE_URL_PATTERN.matcher(request.getJobName());
        if (matcher.find()) {
            request.setInstanceUrl(matcher.group());
        }
        request.setJobName(getChildNodeValue(jobNode, "name"));
        return create(request);
    }
    
    static class RundeckXMLParser {
        
        private NodeList nodes;
        private final Map<String, Node> optionNameNode;
        
        public RundeckXMLParser(Document doc) {
            nodes = doc.getElementsByTagName("option");
            optionNameNode = IntStream.range(0, nodes.getLength())
                .mapToObj(i -> nodes.item(i))
                .collect(Collectors.toMap(n -> getAttributeValue(n, "name"), n -> n));
        }
        
        public static String getAttributeValue(Node node, String attributeName) {
            if (node == null) {
                return null;
            }
            Node attributeNode = node.getAttributes().getNamedItem(attributeName);
            if (attributeNode == null) {
                return null;
            } else {
                return attributeNode.getNodeValue();
            }
        }
        
        public static String getChildNodeAttribute(Node node, String childNodeName, String attributeName) {
            return actOnChildNode(node, childNodeName, n -> getAttributeValue(n, attributeName));
        }
        
        public static String getChildNodeValue(Node node, String childNodeName) {
            return actOnChildNode(node, childNodeName, n -> n.getNodeValue());
        }
        
        public static String actOnChildNode(Node node, String childNodeName, Function<Node, String> valueSupplier) {
            Optional<Node> childNode = getNamedChild(node, childNodeName);
            if (childNode.isPresent()) {
                return valueSupplier.apply(childNode.get());
            } else {
                return null;
            }
        }
        
        public static Optional<Node> getNamedChild(Node node, String childNodeName) {
            NodeList nodes = node.getChildNodes();
            return IntStream.range(0, nodes.getLength())
                .filter(i -> childNodeName.equals(nodes.item(i).getNodeName()))
                .mapToObj(i -> nodes.item(i))
                .findFirst();
        }
        
        public String findMatchingOption(String... optionNames) {
            List<String> options = Arrays.asList(optionNames);
            return options.stream().filter(opt -> optionNameNode.keySet().contains(opt))
                .findFirst()
                .map(opt -> getAttributeValue(optionNameNode.get(opt), "value")).orElse(null);    
        }
    }
}
