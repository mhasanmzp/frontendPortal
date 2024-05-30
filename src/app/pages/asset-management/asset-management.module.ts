import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssetManagementPageRoutingModule } from './asset-management-routing.module';

import { AssetManagementPage } from './asset-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssetManagementPageRoutingModule
  ],
  declarations: [AssetManagementPage]
})
export class AssetManagementPageModule {}
