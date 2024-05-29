import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacityPage } from './capacity.page';

const routes: Routes = [
  {
    path: '',
    component: CapacityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapacityPageRoutingModule {}
