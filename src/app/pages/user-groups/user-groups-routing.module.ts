import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserGroupsPage } from './user-groups.page';

const routes: Routes = [
  {
    path: '',
    component: UserGroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupsPageRoutingModule {}
