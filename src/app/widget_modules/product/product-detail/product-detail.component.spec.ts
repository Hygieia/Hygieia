import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailComponent ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set detailData', () => {
    const detailData = [{
      title: 'productTitle',
      url: 'productUrl',
      lastUpdated: 1587131351,
      data: [{
        name: 'name',
        items: [],
      }],
    }];

    component.detailData = detailData;
    expect(component.data.length).toEqual(1);

    const noData = [{
      title: 'productTitle',
      url: 'productUrl',
      lastUpdated: 1587131351,
    }];

    component.detailData = noData;
    expect(component.data[0]).toEqual(noData);
  });
});
