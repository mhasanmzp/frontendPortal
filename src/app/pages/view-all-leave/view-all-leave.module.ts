import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllLeavePageRoutingModule } from './view-all-leave-routing.module';

import { ViewAllLeavePage } from './view-all-leave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllLeavePageRoutingModule
  ],
  declarations: [ViewAllLeavePage]
})
export class ViewAllLeavePageModule {}
