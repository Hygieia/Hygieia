package com.capitalone.dashboard.status;

public enum DashboardAuditStatus {
    DASHBOARD_BAD_LOOKUP_DATA,
    DASHBOARD_REPO_NOT_CONFIGURED,
    DASHBOARD_BUILD_CONFIGURED,
    DASHBOARD_BUILD_NOT_CONFIGURED,
    DASHBOARD_CODEQUALITY_CONFIGURED,
    DASHBOARD_CODEQUALITY_NOT_CONFIGURED,
    DASHBOARD_STATIC_SECURITY_ANALYSIS_CONFIGURED,
    DASHBOARD_STATIC_SECURITY_ANALYSIS_NOT_CONFIGURED,
    DASHBOARD_NOT_REGISTERED,
    DASHBOARD_TEST_CONFIGURED,
    DASHBOARD_TEST_NOT_CONFIGURED,
    DASHBOARD_REPO_BUILD_VALID,
    DASHBOARD_REPO_BUILD_INVALID,
    DASHBOARD_REPO_PR_AUTHOR_EQ_BUILD_AUTHOR,
    DASHBOARD_REPO_PR_AUTHOR_NE_BUILD_AUTHOR,
    // Error collecting from repo
    COLLECTOR_ITEM_ERROR, // Git repo not configured
    DASHBOARD_PERFORMANCE_TEST_CONFIGURED, DASHBOARD_PERFORMANCE_TEST_NOT_CONFIGURED, DASHBOARD_REPO_CONFIGURED
}
