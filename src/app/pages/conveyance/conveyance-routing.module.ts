import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConveyancePage } from './conveyance.page';

const routes: Routes = [
  {
    path: '',
    component: ConveyancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConveyancePageRoutingModule {}
