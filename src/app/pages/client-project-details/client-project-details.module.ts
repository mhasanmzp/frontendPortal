import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ClientProjectDetailsPageRoutingModule } from './client-project-details-routing.module';
import { ClientProjectDetailsPage } from './client-project-details.page';
import { ProjectDashboardComponent } from 'src/app/components/project-dashboard/project-dashboard.component';
import { ProjectSprintsComponent } from '../../components/project-sprints/project-sprints.component'
import { ClientDashboardComponent } from 'src/app/components/client-dashboard/client-dashboard.component';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    IonicModule,
    ClientProjectDetailsPageRoutingModule
  ],
  declarations: [ClientProjectDetailsPage, ProjectDashboardComponent,ClientDashboardComponent, ProjectSprintsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientProjectDetailsPageModule {}
