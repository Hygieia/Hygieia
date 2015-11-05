package com.capitalone.dashboard.service;

import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.capitalone.dashboard.model.CodeQuality;
import com.capitalone.dashboard.model.Collector;
import com.capitalone.dashboard.model.CollectorItem;
import com.capitalone.dashboard.model.CollectorType;
import com.capitalone.dashboard.model.Component;
import com.capitalone.dashboard.model.DataResponse;
import com.capitalone.dashboard.model.QCodeQuality;
import com.capitalone.dashboard.repository.CodeQualityRepository;
import com.capitalone.dashboard.repository.CollectorRepository;
import com.capitalone.dashboard.repository.ComponentRepository;
import com.capitalone.dashboard.request.CodeQualityRequest;
import com.mysema.query.BooleanBuilder;

@Service
public class CodeQualityServiceImpl implements CodeQualityService {

	private final CodeQualityRepository codeQualityRepository;
	private final ComponentRepository componentRepository;
	private final CollectorRepository collectorRepository;

	@Autowired
	public CodeQualityServiceImpl(CodeQualityRepository codeQualityRepository,
			ComponentRepository componentRepository,
			CollectorRepository collectorRepository) {
		this.codeQualityRepository = codeQualityRepository;
		this.componentRepository = componentRepository;
		this.collectorRepository = collectorRepository;
	}

	@Override
	public DataResponse<Iterable<CodeQuality>> search(CodeQualityRequest request) {
		Component component = componentRepository.findOne(request
				.getComponentId());
		CollectorItem item = null;
		Iterable<CodeQuality> result = null;
		if (request.getType() == null) {
			item = component.getCollectorItems().get(CollectorType.CodeQuality)
					.get(0);
		} else {
			switch (request.getType()) {
			case StaticAnalysis:
				if ((component.getCollectorItems() != null)
						&& (component.getCollectorItems().get(
								CollectorType.CodeQuality) != null)) {
					item = component.getCollectorItems()
							.get(CollectorType.CodeQuality).get(0);
				}
				break;

			case SecurityAnalysis:
				if ((component.getCollectorItems() != null)
						&& (component.getCollectorItems().get(
								CollectorType.StaticSecurityScan) != null)) {
					item = component.getCollectorItems()
							.get(CollectorType.StaticSecurityScan).get(0);
				}
				break;

			default:
				if ((component.getCollectorItems() != null)
						&& (component.getCollectorItems().get(
								CollectorType.CodeQuality) != null)) {
					item = component.getCollectorItems()
							.get(CollectorType.CodeQuality).get(0);
				}
				break;
			}

		}
		
		if (item == null) {
			
			return new DataResponse<>(result, System.currentTimeMillis());
		}
		
		QCodeQuality quality = new QCodeQuality("quality");
		BooleanBuilder builder = new BooleanBuilder();

		builder.and(quality.collectorItemId.eq(item.getId()));

		if (request.getNumberOfDays() != null) {
			long endTimeTarget = new LocalDate()
					.minusDays(request.getNumberOfDays()).toDate().getTime();
			builder.and(quality.timestamp.goe(endTimeTarget));
		} else {
			if (request.validDateRange()) {
				builder.and(quality.timestamp.between(request.getDateBegins(),
						request.getDateEnds()));
			}
		}

		
		if (request.getMax() == null) {
			result = codeQualityRepository.findAll(builder.getValue(),
					quality.timestamp.desc());
		} else {
			PageRequest pageRequest = new PageRequest(0, request.getMax(),
					Sort.Direction.DESC, "timestamp");
			result = codeQualityRepository.findAll(builder.getValue(),
					pageRequest).getContent();
		}

		Collector collector = collectorRepository
				.findOne(item.getCollectorId());
		return new DataResponse<>(result, collector.getLastExecuted());
	}
}
