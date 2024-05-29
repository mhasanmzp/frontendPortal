import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAttendancePageRoutingModule } from './user-attendance-routing.module';

import { UserAttendancePage } from './user-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAttendancePageRoutingModule
  ],
  declarations: [UserAttendancePage]
})
export class UserAttendancePageModule {}
