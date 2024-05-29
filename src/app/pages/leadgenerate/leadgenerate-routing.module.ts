import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadgeneratePage } from './leadgenerate.page';

const routes: Routes = [
  {
    path: '',
    component: LeadgeneratePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadgeneratePageRoutingModule {}
