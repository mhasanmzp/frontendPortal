import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditKraPageRoutingModule } from './edit-kra-routing.module';

import { EditKraPage } from './edit-kra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    EditKraPageRoutingModule
  ],
  declarations: [EditKraPage]
})
export class EditKraPageModule {}
