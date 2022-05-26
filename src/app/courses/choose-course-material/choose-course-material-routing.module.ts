import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseCourseMaterialPage } from './choose-course-material.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseCourseMaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseCourseMaterialPageRoutingModule {}
