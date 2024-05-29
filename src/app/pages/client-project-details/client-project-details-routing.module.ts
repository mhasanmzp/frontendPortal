import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientProjectDetailsPage } from './client-project-details.page';

const routes: Routes = [
  {
    path: '',
    component: ClientProjectDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientProjectDetailsPageRoutingModule {}
