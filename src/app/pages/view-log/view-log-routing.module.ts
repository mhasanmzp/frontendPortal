import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewLogPage } from './view-log.page';

const routes: Routes = [
  {
    path: '',
    component: ViewLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewLogPageRoutingModule {}
