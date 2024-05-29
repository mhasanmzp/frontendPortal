import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TeamsPageRoutingModule } from './teams-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { TeamsPage } from './teams.page';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    IonicModule,
    TeamsPageRoutingModule
  ],
  declarations: [TeamsPage]
})
export class TeamsPageModule {}
