import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditKraPage } from './edit-kra.page';

const routes: Routes = [
  {
    path: '',
    component: EditKraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditKraPageRoutingModule {}
