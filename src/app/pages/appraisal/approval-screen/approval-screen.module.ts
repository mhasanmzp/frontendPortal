import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalScreenPageRoutingModule } from './approval-screen-routing.module';

import { ApprovalScreenPage } from './approval-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalScreenPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [ApprovalScreenPage]
})
export class ApprovalScreenPageModule {}
