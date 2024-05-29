import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllKraPage } from './view-all-kra.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllKraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllKraPageRoutingModule {}
