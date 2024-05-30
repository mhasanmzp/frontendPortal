import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssetManagementPage } from './asset-management.page';

const routes: Routes = [
  {
    path: '',
    component: AssetManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetManagementPageRoutingModule {}
