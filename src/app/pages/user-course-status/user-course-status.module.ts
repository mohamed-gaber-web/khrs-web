import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserCourseStatusPageRoutingModule } from './user-course-status-routing.module';

import { UserCourseStatusPage } from './user-course-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserCourseStatusPageRoutingModule,
    SharedModule
  ],
  declarations: [UserCourseStatusPage]
})
export class UserCourseStatusPageModule {}
