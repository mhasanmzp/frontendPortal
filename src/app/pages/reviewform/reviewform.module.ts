import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewformPageRoutingModule } from './reviewform-routing.module';

import { ReviewformPage } from './reviewform.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewformPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [ReviewformPage]
})
export class ReviewformPageModule {}
