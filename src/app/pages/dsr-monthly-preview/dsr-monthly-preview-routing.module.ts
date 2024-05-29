import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DsrMonthlyPreviewPage } from './dsr-monthly-preview.page';

const routes: Routes = [
  {
    path: '',
    component: DsrMonthlyPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsrMonthlyPreviewPageRoutingModule {}
