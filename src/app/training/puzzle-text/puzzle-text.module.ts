import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuzzleTextPageRoutingModule } from './puzzle-text-routing.module';

import { PuzzleTextPage } from './puzzle-text.page';

import {DragDropModule} from '@angular/cdk/drag-drop';

import {MatPaginatorModule} from '@angular/material/paginator';
import { HelpModalModule } from '../help-modal/help-modal.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PuzzleTextPageRoutingModule,
    DragDropModule,
    MatPaginatorModule,
    HelpModalModule,
    SharedModule
  ],
  declarations: [PuzzleTextPage]
})
export class PuzzleTextPageModule {}
