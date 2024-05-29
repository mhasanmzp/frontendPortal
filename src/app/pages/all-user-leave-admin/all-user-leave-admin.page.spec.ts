import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllUserLeaveAdminPage } from './all-user-leave-admin.page';

describe('AllUserLeaveAdminPage', () => {
  let component: AllUserLeaveAdminPage;
  let fixture: ComponentFixture<AllUserLeaveAdminPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUserLeaveAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllUserLeaveAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
