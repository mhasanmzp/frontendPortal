import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapacityPageRoutingModule } from './capacity-routing.module';

import { CapacityPage } from './capacity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapacityPageRoutingModule
  ],
  declarations: [CapacityPage]
})
export class CapacityPageModule {}
