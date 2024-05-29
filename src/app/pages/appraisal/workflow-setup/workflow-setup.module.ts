import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkflowSetupPageRoutingModule } from './workflow-setup-routing.module';

import { WorkflowSetupPage } from './workflow-setup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkflowSetupPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [WorkflowSetupPage]
})
export class WorkflowSetupPageModule {}
