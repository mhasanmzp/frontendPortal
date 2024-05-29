import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPostPageRoutingModule } from './new-post-routing.module';

import { NewPostPage } from './new-post.page';
import { QuillModule } from 'ngx-quill'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    IonicModule,
    NewPostPageRoutingModule
  ],
  declarations: [NewPostPage]
})
export class NewPostPageModule {}
