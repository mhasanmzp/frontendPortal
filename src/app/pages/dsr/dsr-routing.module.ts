import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DsrPage } from './dsr.page';

const routes: Routes = [
  {
    path: '',
    component: DsrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsrPageRoutingModule {}
