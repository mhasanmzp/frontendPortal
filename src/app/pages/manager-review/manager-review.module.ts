import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerReviewPageRoutingModule } from './manager-review-routing.module';

import { ManagerReviewPage } from './manager-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerReviewPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [ManagerReviewPage]
})
export class ManagerReviewPageModule {}
