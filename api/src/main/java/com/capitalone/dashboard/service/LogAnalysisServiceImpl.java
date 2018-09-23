package com.capitalone.dashboard.service;

import com.capitalone.dashboard.model.Collector;
import com.capitalone.dashboard.model.CollectorItem;
import com.capitalone.dashboard.model.CollectorType;
import com.capitalone.dashboard.model.Component;
import com.capitalone.dashboard.model.DataResponse;
import com.capitalone.dashboard.model.LogAnalysis;
import com.capitalone.dashboard.model.QLogAnalysis;
import com.capitalone.dashboard.repository.CollectorRepository;
import com.capitalone.dashboard.repository.ComponentRepository;
import com.capitalone.dashboard.repository.LogAnalysizerRepository;
import com.capitalone.dashboard.request.LogAnalysisSearchRequest;
import com.mysema.query.BooleanBuilder;
import org.springframework.stereotype.Service;

/**
 * Created by stevegal on 22/06/2018.
 */
@Service
public class LogAnalysisServiceImpl implements LogAnalysisService {

  private final ComponentRepository componentRepository;
  private final CollectorRepository collectorRepository;
  private LogAnalysizerRepository repository;

  public LogAnalysisServiceImpl(LogAnalysizerRepository repository,
                                ComponentRepository componentRepository,
                                CollectorRepository collectorRepository) {
    this.collectorRepository = collectorRepository;
    this.componentRepository = componentRepository;
    this.repository = repository;
  }

  @Override
  public DataResponse<Iterable<LogAnalysis>> search(LogAnalysisSearchRequest request) {
    if (null == request) {
      return emptyResponse();
    }
    Component component = componentRepository.findOne(request.getComponentId());
    if (null == component) {
      return emptyResponse();
    }
    CollectorItem item = component.getFirstCollectorItemForType(CollectorType.Log);
    if (null == item) {
      return emptyResponse();
    }
    BooleanBuilder builder = new BooleanBuilder();
    QLogAnalysis log = new QLogAnalysis("logAnalysis");
    builder.and(log.collectorItemId.eq(item.getId()));

    Iterable<LogAnalysis> result = this.repository.findAll(builder.getValue(), log.timestamp.desc());

    Collector collector = collectorRepository.findOne(item.getCollectorId());
    return new DataResponse<>(result,collector.getLastExecuted());
  }

  private DataResponse<Iterable<LogAnalysis>> emptyResponse() {
    return  new DataResponse<>(null,System.currentTimeMillis());
  }
}