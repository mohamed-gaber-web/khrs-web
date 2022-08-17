import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplyCoursePageRoutingModule } from './apply-course-routing.module';

import { ApplyCoursePage } from './apply-course.page';

import { TranslateModule } from '@ngx-translate/core';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplyCoursePageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,


  ],
  exports: [
    MatDatepickerModule,
    MatInputModule,
  ],
  declarations: [ApplyCoursePage]
})
export class ApplyCoursePageModule {}
