import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { DragScrollModule } from "cdk-drag-scroll";
import { HelpModalModule } from '../../help-modal/help-modal.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { PuzzleSoundTestModule } from './puzzle-sound-test/puzzle-sound-test.module';
import { PuzzleSoundTestComponent } from './puzzle-sound-test/puzzle-sound-test.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DragDropModule,
    DragScrollModule,
    HelpModalModule,
    // PuzzleSoundTestModule,
  ],

  declarations: [],
  // entryComponents: [PuzzleSoundTestComponent],

})
export class PuzzleImageTestPageModule {}
