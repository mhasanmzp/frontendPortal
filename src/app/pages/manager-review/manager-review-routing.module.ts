import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerReviewPage } from './manager-review.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerReviewPageRoutingModule {}
