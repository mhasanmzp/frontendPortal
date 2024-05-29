import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadgeneratePageRoutingModule } from './leadgenerate-routing.module';

import { LeadgeneratePage } from './leadgenerate.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadgeneratePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LeadgeneratePage]
})
export class LeadgeneratePageModule {}
