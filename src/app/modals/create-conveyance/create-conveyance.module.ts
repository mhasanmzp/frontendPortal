import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateConveyancePageRoutingModule } from './create-conveyance-routing.module';

import { CreateConveyancePage } from './create-conveyance.page';
import {ReactiveFormsModule} from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateConveyancePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateConveyancePage]
})
export class CreateConveyancePageModule {}
