import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllDsrPage } from './view-all-dsr.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllDsrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllDsrPageRoutingModule {}
