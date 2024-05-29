import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DsrPageRoutingModule } from './dsr-routing.module';
import { DsrPage } from './dsr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DsrPageRoutingModule
  ],
  declarations: [DsrPage]
})
export class DsrPageModule {}
