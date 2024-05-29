import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DsrMonthlyPreviewPageRoutingModule } from './dsr-monthly-preview-routing.module';

import { DsrMonthlyPreviewPage } from './dsr-monthly-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DsrMonthlyPreviewPageRoutingModule
  ],
  declarations: [DsrMonthlyPreviewPage]
})
export class DsrMonthlyPreviewPageModule {}
