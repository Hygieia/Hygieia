import {Component, NgModule} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DashStatusComponent } from '../../dash-status/dash-status.component';
import {CommonModule } from '@angular/common';
import {RotationChartComponent} from './rotation-chart.component';
import {DashStatus, IClickListData, IClickListItem} from '../click-list/click-list-interfaces';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [],
  entryComponents: [],
})
class TestModule { }

@Component({
  selector: 'app-test-detail-view',
  template: '',
})
export class TestDetailViewComponent {}

describe('RotationChartComponent', () => {
  let component: RotationChartComponent;
  let fixture: ComponentFixture<RotationChartComponent>;
  let modal: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDetailViewComponent, RotationChartComponent, TimeAgoPipe, DashStatusComponent],
      imports: [TestModule, NgbModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotationChartComponent);
    component = fixture.componentInstance;
    modal = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open detail view', () => {
    component.data = {
      items: [
        {
          status: DashStatus.PASS,
          statusText: 'Passing',
          title: 'Test title',
          subtitles: [
            'Test'
          ],
          url: 'firstTestUrl.com',
          lastUpdated: 11111
        } as IClickListItem,
      ],
      clickableContent: TestDetailViewComponent,
      clickableHeader: TestDetailViewComponent
    } as IClickListData;
    spyOn(modal, 'open').and.returnValue({
      componentInstance: {
        title: undefined,
        detailData: undefined
      }
    });
    component.openDetailView(null);
  });

  it('should open detail view', () => {
    component.unlockTabs('foo', 'bar');
  });
});
