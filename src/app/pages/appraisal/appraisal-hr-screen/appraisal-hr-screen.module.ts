import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { IonicModule } from '@ionic/angular';

import { AppraisalHrScreenPageRoutingModule } from './appraisal-hr-screen-routing.module';

import { AppraisalHrScreenPage } from './appraisal-hr-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppraisalHrScreenPageRoutingModule,ReactiveFormsModule,Ng2SearchPipeModule
  ],
  declarations: [AppraisalHrScreenPage]
})
export class AppraisalHrScreenPageModule {}
