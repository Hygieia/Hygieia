import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CollectorsService } from '../../../services/collectors.service';
import { CollectorsComponent } from './collectors.component';

class MockCollectorService {
  getAllCollectors() {
    const mockCollectorList = [
      {
        name: 'github',
        online: true,
        collectorType: 'foo',
        enabled: true,
        lastExecuted: 141312837,
        runDuration: 1234
      },
      {
        name: 'jmeter',
        online: false,
        collectorType: 'bar',
        enabled: false,
        lastExecuted: 9876543,
        runDuration: 1123
      }
    ];
    return of(mockCollectorList);
  }
}

describe('CollectorsComponent', () => {
  let component: CollectorsComponent;
  let fixture: ComponentFixture<CollectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectorsComponent ],
      providers: [{ provide: CollectorsService, useClass: MockCollectorService }],
      imports: [ MatIconModule, MatTableModule, NoopAnimationsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert time to readable format', () => {
    const stringTime = component.convertToReadable(1616464805371);
    expect(stringTime).toBe('Tue, 23 Mar 2021 02:00:05 GMT');
  });

  it('should return array of keys', () => {
    const fields = {
      field1: '',
      field2: ''
    };
    const keysExpected = ['field1', 'field2'];
    const keys = component.getFields(fields);
    console.log(keys);
    expect(keys).toEqual(keysExpected);
  });

  it('should return empty array of keys', () => {
    const fields = {};
    const keysExpected = [];
    const keys = component.getFields(fields);
    console.log(keys);
    expect(keys).toEqual(keysExpected);
  });
});
