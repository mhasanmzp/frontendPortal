import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeEvaluationPage } from './employee-evaluation.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeEvaluationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeEvaluationPageRoutingModule {}
