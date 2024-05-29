import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewformPage } from './reviewform.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewformPageRoutingModule {}
