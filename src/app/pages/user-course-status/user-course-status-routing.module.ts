import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCourseStatusPage } from './user-course-status.page';

const routes: Routes = [
  {
    path: '',
    component: UserCourseStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCourseStatusPageRoutingModule {}
