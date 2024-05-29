import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmountSetupPage } from './amount-setup.page';

const routes: Routes = [
  {
    path: '',
    component: AmountSetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmountSetupPageRoutingModule {}
