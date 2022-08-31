import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { DragScrollModule } from "cdk-drag-scroll";
import { HelpModalModule } from '../../help-modal/help-modal.module';

// import { PuzzleImageZoomComponent } from './puzzle-image-zoom/puzzle-image-zoom.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DragDropModule,
    DragScrollModule,
    HelpModalModule,
  ],

  declarations: [],


})
export class PuzzleImageTestPageModule {}
