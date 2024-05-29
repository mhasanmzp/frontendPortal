import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmountSetupPageRoutingModule } from './amount-setup-routing.module';

import { AmountSetupPage } from './amount-setup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmountSetupPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [AmountSetupPage]
})
export class AmountSetupPageModule {}
