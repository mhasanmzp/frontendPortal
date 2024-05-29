import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalScreenPage } from './approval-screen.page';

const routes: Routes = [
  {
    path: '',
    component: ApprovalScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalScreenPageRoutingModule {}
