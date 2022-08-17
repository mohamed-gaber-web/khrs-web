import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseCourseMaterialPageRoutingModule } from './choose-course-material-routing.module';

import { ChooseCourseMaterialPage } from './choose-course-material.page';
import { CourseRatingComponent } from './course-rating/course-rating/course-rating.component';
import { NgbModule }from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseCourseMaterialPageRoutingModule,
    NgbModule
  ],
  declarations: [ChooseCourseMaterialPage, CourseRatingComponent]
})
export class ChooseCourseMaterialPageModule {}
