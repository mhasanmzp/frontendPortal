import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAssetPageRoutingModule } from './add-asset-routing.module';

import { AddAssetPage } from './add-asset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAssetPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddAssetPage]
})
export class AddInventoryPageModule {}
