package com.capitalone.dashboard.status;

public enum CodeReviewAuditStatus {
    //peer review type LGTM, GH REVIEW, COMMENTS ONLY
    PEER_REVIEW_LGTM_SELF_APPROVAL,
    PEER_REVIEW_LGTM_ERROR,
    PEER_REVIEW_LGTM_PENDING,
    PEER_REVIEW_LGTM_UNKNOWN,
    PEER_REVIEW_LGTM_SUCCESS,

    PEER_REVIEW_GHR,
    PEER_REVIEW_GHR_SELF_APPROVAL,
    PEER_REVIEW_REG_COMMENTS,
    PEER_REVIEW_REV_COMMENTS,
    //no pull requests for queried date range
    NO_PULL_REQ_FOR_DATE_RANGE,
    //direct commits to master
    DIRECT_COMMITS_TO_BASE,
    DIRECT_COMMITS_TO_BASE_FIRST_COMMIT,
    //commit author v/s who merged the pr
    COMMITAUTHOR_NE_MERGECOMMITER,
    COMMITAUTHOR_EQ_MERGECOMMITER,
    MERGECOMMITER_NOT_FOUND,

    //peer review of a pull request
    PULLREQ_REVIEWED_BY_PEER,
    PULLREQ_NOT_PEER_REVIEWED,
    BASE_FIRST_COMMIT,

    //type of git workflow
    GIT_FORK_STRATEGY,
    GIT_BRANCH_STRATEGY,
    GIT_NO_WORKFLOW,

    NO_COMMIT_FOR_DATE_RANGE, //Removew this later when we can remove legacy peer review
    COMMIT_AFTER_PR_MERGE, COLLECTOR_ITEM_ERROR
}
