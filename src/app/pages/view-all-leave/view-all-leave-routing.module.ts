import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllLeavePage } from './view-all-leave.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllLeavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllLeavePageRoutingModule {}
