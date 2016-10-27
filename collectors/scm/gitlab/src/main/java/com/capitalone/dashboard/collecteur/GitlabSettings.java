package com.capitalone.dashboard.collecteur;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created by benathmane on 23/06/16.
 */

/**
 * Bean to hold settings specific to the Gitlab collector.
 */

@Component
@ConfigurationProperties(prefix = "gitlab")
public class GitlabSettings {
    private String cron;
    private String host;
    private String apiToken;
	private int firstRunHistoryDays;
	private boolean selfSigned;

    public String getCron() {
        return cron;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getFirstRunHistoryDays() {
		return firstRunHistoryDays;
	}

	public void setFirstRunHistoryDays(int firstRunHistoryDays) {
		this.firstRunHistoryDays = firstRunHistoryDays;
	}

	public boolean isSelfSigned() {
		return selfSigned;
	}
	
	public void setSelfSigned(boolean selfSigned) {
		this.selfSigned = selfSigned;
	}

}
