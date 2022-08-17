import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCoursesPageRoutingModule } from './my-courses-routing.module';

import { MyCoursesPage } from './my-courses.page';

import { CourseIntroSound } from '../course-intro-sound/course-intro-sound.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCoursesPageRoutingModule,
    CourseIntroSound
  ],
  declarations: [MyCoursesPage]
})
export class MyCoursesPageModule {}
