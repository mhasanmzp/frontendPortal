import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OrganizationStructurePageRoutingModule } from './organization-structure-routing.module';
import { OrganizationStructurePage } from './organization-structure.page';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { OrgChartComponent } from '../../components/org-chart/org-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,NgxOrgChartModule,
    OrganizationStructurePageRoutingModule
  ],
  declarations: [OrganizationStructurePage, OrgChartComponent]
})
export class OrganizationStructurePageModule {}
