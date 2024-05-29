import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignInventoryItemPageRoutingModule } from './assign-inventory-item-routing.module';

import { AssignInventoryItemPage } from './assign-inventory-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignInventoryItemPageRoutingModule
  ],
  declarations: [AssignInventoryItemPage]
})
export class AssignInventoryItemPageModule {}
