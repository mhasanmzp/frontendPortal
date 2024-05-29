import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppraisalHrScreenPage } from './appraisal-hr-screen.page';

const routes: Routes = [
  {
    path: '',
    component: AppraisalHrScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalHrScreenPageRoutingModule {}
