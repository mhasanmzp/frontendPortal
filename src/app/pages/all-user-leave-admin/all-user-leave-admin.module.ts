import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllUserLeaveAdminPageRoutingModule } from './all-user-leave-admin-routing.module';

import { AllUserLeaveAdminPage } from './all-user-leave-admin.page';
// import {Ng2SearchPipeModule} from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllUserLeaveAdminPageRoutingModule,
    // Ng2SearchPipeModule
  ],
  declarations: [AllUserLeaveAdminPage],
  
})
export class AllUserLeaveAdminPageModule {}
