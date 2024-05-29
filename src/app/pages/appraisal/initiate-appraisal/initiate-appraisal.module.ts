import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitiateAppraisalPageRoutingModule } from './initiate-appraisal-routing.module';

import { InitiateAppraisalPage } from './initiate-appraisal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitiateAppraisalPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [InitiateAppraisalPage]
})
export class InitiateAppraisalPageModule {}
