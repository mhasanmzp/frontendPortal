import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaisedTicketPage } from './raised-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: RaisedTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaisedTicketPageRoutingModule {}
