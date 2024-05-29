import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectManagePageRoutingModule } from './project-manage-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProjectManagePage } from './project-manage.page';
import { ProjectDashboardComponent } from '../../components/project-dashboard/project-dashboard.component'
import { ProjectSprintsComponent } from '../../components/project-sprints/project-sprints.component'
import { ProjectBoardComponent } from '../../components/project-board/project-board.component'
import { QuillModule } from 'ngx-quill';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverlayModule,
    DragDropModule,
    QuillModule,NgxEchartsModule.forChild(),
    ProjectManagePageRoutingModule,
  ],
  declarations: [ProjectManagePage, ProjectDashboardComponent, ProjectSprintsComponent, ProjectBoardComponent]
})
export class ProjectManagePageModule {}
