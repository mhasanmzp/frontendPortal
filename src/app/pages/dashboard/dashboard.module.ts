import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DsrComponent } from '../../components/dsr/dsr.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { TeamComponent } from '../../components/team/team.component'
import { ViewDsrComponent } from '../../components/view-dsr/view-dsr.component'
import { DashboardPage } from './dashboard.page';
import { LeaveComponent } from '../../components/leave/leave.component';
import { ViewAllKraComponent } from '../../components/view-all-kra/view-all-kra.component';
import { ProjectReportComponent } from '../../components/project-report/project-report.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { AssignedTicketComponent } from 'src/app/components/assigned-ticket/assigned-ticket.component';
import { AssignedConveyanceComponent } from 'src/app/components/assigned-conveyance/assigned-conveyance.component';
import { CmfPageComponent } from 'src/app/components/cmf-page/cmf-page.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    IonicModule,
    DashboardPageRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    ReactiveFormsModule
  ],
  declarations: [DashboardPage, DsrComponent, ViewDsrComponent, TeamComponent, CmfPageComponent,
    LeaveComponent, ViewAllKraComponent, ProjectReportComponent,AssignedTicketComponent,AssignedConveyanceComponent
  ]
})
export class DashboardPageModule {}
