import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateConveyancePage } from './create-conveyance.page';

const routes: Routes = [
  {
    path: '',
    component: CreateConveyancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateConveyancePageRoutingModule {}
