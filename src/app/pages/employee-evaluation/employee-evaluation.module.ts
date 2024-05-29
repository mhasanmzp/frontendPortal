import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeEvaluationPageRoutingModule } from './employee-evaluation-routing.module';

import { EmployeeEvaluationPage } from './employee-evaluation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeEvaluationPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [EmployeeEvaluationPage]
})
export class EmployeeEvaluationPageModule {}
