import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationStructurePage } from './organization-structure.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationStructurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationStructurePageRoutingModule {}
