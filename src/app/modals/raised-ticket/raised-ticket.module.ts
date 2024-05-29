import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaisedTicketPageRoutingModule } from './raised-ticket-routing.module';

import { RaisedTicketPage } from './raised-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    RaisedTicketPageRoutingModule
  ],
  declarations: [RaisedTicketPage]
})
export class RaisedTicketPageModule {}
