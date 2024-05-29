import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavesPage } from './leaves.page';

const routes: Routes = [
  {
    path: '',
    component: LeavesPage
  },  {
    path: 'add-leave',
    loadChildren: () => import('./add-leave/add-leave.module').then( m => m.AddLeavePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavesPageRoutingModule {}
