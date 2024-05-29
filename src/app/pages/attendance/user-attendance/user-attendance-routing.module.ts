import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAttendancePage } from './user-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: UserAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAttendancePageRoutingModule {}
