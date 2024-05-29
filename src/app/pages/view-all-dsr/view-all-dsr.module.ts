import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllDsrPageRoutingModule } from './view-all-dsr-routing.module';

import { ViewAllDsrPage } from './view-all-dsr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllDsrPageRoutingModule
  ],
  declarations: [ViewAllDsrPage]
})
export class ViewAllDsrPageModule {}
