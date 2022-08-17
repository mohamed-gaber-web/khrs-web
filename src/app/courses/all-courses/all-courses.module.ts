import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllCoursesPageRoutingModule } from './all-courses-routing.module';

import { AllCoursesPage } from './all-courses.page';

import { CourseItemComponent } from '../course-item/course-item.component';

import { CourseIntroSound } from '../course-intro-sound/course-intro-sound.module';

import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllCoursesPageRoutingModule,
    CourseIntroSound,
    SharedModule
  ],
  declarations: [AllCoursesPage, CourseItemComponent]
 
})
export class AllCoursesPageModule {}
