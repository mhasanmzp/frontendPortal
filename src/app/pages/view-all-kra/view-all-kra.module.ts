import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllKraPageRoutingModule } from './view-all-kra-routing.module';

import { ViewAllKraPage } from './view-all-kra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllKraPageRoutingModule
  ],
  declarations: [ViewAllKraPage]
})
export class ViewAllKraPageModule {}
