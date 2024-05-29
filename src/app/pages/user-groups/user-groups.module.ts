import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserGroupsPageRoutingModule } from './user-groups-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { UserGroupsPage } from './user-groups.page';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    IonicModule,
    UserGroupsPageRoutingModule
  ],
  declarations: [UserGroupsPage]
})
export class UserGroupsPageModule {}
