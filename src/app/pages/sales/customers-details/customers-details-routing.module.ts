import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersDetailsPage } from './customers-details.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersDetailsPageRoutingModule {}
