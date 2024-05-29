import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersDetailsPageRoutingModule } from './customers-details-routing.module';

import { CustomersDetailsPage } from './customers-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    CustomersDetailsPageRoutingModule
  ],
  declarations: [CustomersDetailsPage]
})
export class CustomersDetailsPageModule {}
