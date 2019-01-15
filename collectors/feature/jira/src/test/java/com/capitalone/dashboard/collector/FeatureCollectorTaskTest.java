package com.capitalone.dashboard.collector;

import com.capitalone.dashboard.common.TestUtils;
import com.capitalone.dashboard.config.FongoConfig;
import com.capitalone.dashboard.config.TestConfig;

import com.capitalone.dashboard.model.Feature;
import com.capitalone.dashboard.model.FeatureCollector;
import com.capitalone.dashboard.model.Scope;
import com.capitalone.dashboard.model.Team;
import com.capitalone.dashboard.repository.FeatureCollectorRepository;
import com.capitalone.dashboard.repository.FeatureRepository;
import com.capitalone.dashboard.repository.ScopeRepository;
import com.capitalone.dashboard.repository.TeamRepository;
import com.capitalone.dashboard.testutil.GsonUtil;
import com.capitalone.dashboard.util.Supplier;
import com.github.fakemongo.junit.FongoRule;
import com.google.common.io.Resources;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.RestOperations;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.contains;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class, FongoConfig.class})
@DirtiesContext
public class FeatureCollectorTaskTest {

    private String TEAM_TYPE_KANBAN = "kanban";
    private String TEAM_TYPE_SCRUM = "scrum";
    @Mock
    private DefaultJiraClient defaultJiraClient;
    @Autowired
    private FeatureCollectorTask featureCollectorTask;
    @Rule
    public FongoRule fongoRule = new FongoRule();
    @Mock
    private Supplier<RestOperations> restOperationsSupplier = mock(Supplier.class);
    @Mock
    private RestOperations rest = mock(RestOperations.class);
    @Autowired
    private FeatureSettings featureSettings;
    @Autowired
    private FeatureCollectorRepository featureCollectorRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private ScopeRepository projectRepository;
    @Autowired
    private FeatureRepository featureRepository;

    private FeatureCollector featureCollector;
    @Before
    public void loadStuff() throws IOException {
        TestUtils.loadCollectorFeature(featureCollectorRepository);
        TestUtils.loadTeams(teamRepository);
        TestUtils.loadScope(projectRepository);
        TestUtils.loadFeature(featureRepository);
        when(restOperationsSupplier.get()).thenReturn(rest);
        defaultJiraClient = new DefaultJiraClient(featureSettings,restOperationsSupplier);
        featureSettings.setJiraBoardAsTeam(true);
        featureCollectorTask = new FeatureCollectorTask(null,featureRepository,teamRepository,projectRepository,featureCollectorRepository,featureSettings,defaultJiraClient);

        featureCollector = featureCollectorTask.getCollector();
        featureCollector.setId(new ObjectId("5c38f2f087cd1f53ca81bd3d"));
    }
   @Test
    public void addBoardAsTeamInformation() throws IOException{
       List<Team> expected = getExpectedReviewResponse("./expected/boardasteam-expected.json");
       doReturn(new ResponseEntity<>(getExpectedJSON("boardsresponse.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
       List<Team> actual = featureCollectorTask.updateTeamInformation(featureCollector);

        assertEquals(expected, actual);
    }
    @Test
    public void updateTeamAsBoardInformation() throws IOException{
        doReturn(new ResponseEntity<>(getExpectedJSON("boardsresponse-update.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        List<Team> expected = featureCollectorTask.updateTeamInformation(featureCollector);

        assertNotNull(teamRepository.findByName(expected.get(0).getName()));
    }
    @Test
    public void updateTeamAsBoardType() throws IOException{
        doReturn(new ResponseEntity<>(getExpectedJSON("boardsresponse-update-1.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        List<Team> expected = featureCollectorTask.updateTeamInformation(featureCollector);

        assertEquals(TEAM_TYPE_SCRUM,teamRepository.findByTeamId(expected.get(0).getTeamId()).getTeamType());
    }
    //@Test
    public void addTeamAsBoardInformation() throws IOException{

    }
    //@Test
    public void updateBoardAsTeamInformation() throws IOException{

    }
    @Test
    public void addProjectInformation() throws IOException{
        Set<Scope> expected = getExpectedScopeResponse("./expected/scope-expected.json");
        doReturn(new ResponseEntity<>(getExpectedJSON("projectresponse.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        featureCollectorTask.updateProjectInformation(featureCollector);
        List<Scope> actual = projectRepository.getScopeById("13700");
        assertThat(actual.toArray()[0]).isEqualToIgnoringGivenFields(expected.toArray()[0],"id");
    }
    @Test
    public void updateProjectName() throws IOException{
        Set<Scope> expected = getExpectedScopeResponse("./expected/scope-update-expected.json");
        doReturn(new ResponseEntity<>(getExpectedJSON("projectresponse-update.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));

        featureCollectorTask.updateProjectInformation(featureCollector);
        List<Scope> actual = projectRepository.getScopeById("137001");
        assertThat(actual.toArray()[0]).isEqualToIgnoringGivenFields(expected.toArray()[0],"id");

    }
    @Test
    public void addStoryInformationTypeStory() throws IOException{

        List<Feature> expected = getExpectedFeature("./expected/feature-story-expected.json");
        doReturn(new ResponseEntity<>("{}", HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        doReturn(new ResponseEntity<>(getExpectedJSON("issueresponse-story.json"), HttpStatus.OK)).when(rest).exchange(contains("board/999"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        featureCollectorTask.updateStoryInformation(featureCollector);
        List<Feature> actual = featureRepository.getStoryByTeamID(expected.get(0).getsTeamID());

        assertThat(actual.toArray()[0]).isEqualToIgnoringGivenFields(expected.toArray()[0],"id", "issueLinks");
    }
    //@Test
    public void addStoryInformationTypeEpic() throws IOException{
        List<Feature> expected = getExpectedFeature("./expected/feature-epic-expected.json");
        doReturn(new ResponseEntity<>("{}", HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        doReturn(new ResponseEntity<>(getExpectedJSON("issueresponse-combo.json"), HttpStatus.OK)).when(rest).exchange(contains("board/999"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        featureCollectorTask.updateStoryInformation(featureCollector);
        List<Feature> actual = featureRepository.getStoryByTeamID(expected.get(0).getsTeamID());
        assertThat(actual.toArray()[0]).isEqualToIgnoringGivenFields(expected.toArray()[0],"id", "issueLinks");

    }
   // @Test
    public void addStoryInformationTypeAll() throws IOException{
        doReturn(new ResponseEntity<>(getExpectedJSON("issueresponse-combo.json"), HttpStatus.OK)).when(rest).exchange(contains("jira"), eq(HttpMethod.GET), Matchers.any(HttpEntity.class), eq(String.class));
        featureCollectorTask.updateStoryInformation(featureCollector);
        featureRepository.findAll();
        assertEquals("","");
    }
    //@Test
    public void updateStoryInformation() throws IOException{

    }
    //@Test
    public void addStoryInformationMultiTypes() throws IOException{

    }
    //@Test
    public void updateStoryInformationMultiTypes() throws IOException{

    }

    private String getExpectedJSON(String fileName) throws IOException {
        String path = "./" + fileName;
        URL fileUrl = Resources.getResource(path);
        return IOUtils.toString(fileUrl);
    }

    private List<Team> getExpectedReviewResponse (String fileName) throws IOException {
        Gson gson = GsonUtil.getGson();
        return gson.fromJson(getExpectedJSON(fileName), new TypeToken<List<Team>>(){}.getType());
    }
    private Set<Scope> getExpectedScopeResponse (String fileName) throws IOException {
        Gson gson = GsonUtil.getGson();
        return gson.fromJson(getExpectedJSON(fileName), new TypeToken<Set<Scope>>(){}.getType());
    }
    private List<Feature> getExpectedFeature (String fileName) throws IOException {
        Gson gson = GsonUtil.getGson();
        return gson.fromJson(getExpectedJSON(fileName), new TypeToken<List<Feature>>(){}.getType());
    }
}
