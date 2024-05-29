import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyconstingPage } from './monthlyconsting.page';

const routes: Routes = [
  {
    path: '',
    component: MonthlyconstingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyconstingPageRoutingModule {}
