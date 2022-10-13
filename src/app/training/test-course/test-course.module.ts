import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestCoursePageRoutingModule } from './test-course-routing.module';

import { TestCoursePage } from './test-course.page';

import { SingleTestPage } from './single-test/single-test.page';
import { MultiTestPage } from './multi-test/multi-test.page';
import { PuzzleTextTestPage } from './puzzle-text-test/puzzle-text-test.page';
import { PuzzleImageTestPage } from './puzzle-image-test/puzzle-image-test.page';
import { PuzzleImageZoomComponent } from './puzzle-image-test/puzzle-image-zoom/puzzle-image-zoom.component';
import { TestFinishedPage } from './test-finished/test-finished.page';


import {DragDropModule} from '@angular/cdk/drag-drop';
import { CdTimerModule } from 'angular-cd-timer';
import { SharedModule } from 'src/app/shared/shared.module';
import { PuzzleSoundTestComponent } from './puzzle-image-test/puzzle-sound-test/puzzle-sound-test.component';
import { PuzzleSoundTestModule } from './puzzle-image-test/puzzle-sound-test/puzzle-sound-test.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCoursePageRoutingModule,
    ReactiveFormsModule,
    DragDropModule,
    CdTimerModule,
    SharedModule,
    PuzzleSoundTestModule

  ],
  entryComponents: [TestFinishedPage, PuzzleSoundTestComponent],
  declarations: [
    TestCoursePage,
    SingleTestPage,
    MultiTestPage,
    PuzzleTextTestPage,
    PuzzleImageTestPage,
    PuzzleImageZoomComponent,
    TestFinishedPage
  ],
})
export class TestCoursePageModule {}
