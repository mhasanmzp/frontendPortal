import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewLogPageRoutingModule } from './view-log-routing.module';

import { ViewLogPage } from './view-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewLogPageRoutingModule
  ],
  declarations: [ViewLogPage]
})
export class ViewLogPageModule {}
