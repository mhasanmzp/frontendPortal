import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConveyancePageRoutingModule } from './conveyance-routing.module';

import { ConveyancePage } from './conveyance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConveyancePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ConveyancePage]
})
export class ConveyancePageModule {}
