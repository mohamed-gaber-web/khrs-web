import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseCourseMaterialPageRoutingModule } from './choose-course-material-routing.module';

import { ChooseCourseMaterialPage } from './choose-course-material.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseCourseMaterialPageRoutingModule
  ],
  declarations: [ChooseCourseMaterialPage]
})
export class ChooseCourseMaterialPageModule {}
