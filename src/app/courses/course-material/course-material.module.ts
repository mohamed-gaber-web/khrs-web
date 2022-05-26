import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseMaterialPageRoutingModule } from './course-material-routing.module';

import { CourseMaterialPage } from './course-material.page';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseMaterialPageRoutingModule,
    SharedModule
  ],
  declarations: [CourseMaterialPage]
})
export class CourseMaterialPageModule {}
