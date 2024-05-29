import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DsrMonthlyPreviewPage } from './dsr-monthly-preview.page';

describe('DsrMonthlyPreviewPage', () => {
  let component: DsrMonthlyPreviewPage;
  let fixture: ComponentFixture<DsrMonthlyPreviewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsrMonthlyPreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DsrMonthlyPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
