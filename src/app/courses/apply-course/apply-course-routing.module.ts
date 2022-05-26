import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyCoursePage } from './apply-course.page';

const routes: Routes = [
  {
    path: '',
    component: ApplyCoursePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyCoursePageRoutingModule {}
