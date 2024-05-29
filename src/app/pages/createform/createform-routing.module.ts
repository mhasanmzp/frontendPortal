import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateformPage } from './createform.page';

const routes: Routes = [
  {
    path: '',
    component: CreateformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateformPageRoutingModule {}
