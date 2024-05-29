import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitiateAppraisalPage } from './initiate-appraisal.page';

const routes: Routes = [
  {
    path: '',
    component: InitiateAppraisalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitiateAppraisalPageRoutingModule {}
