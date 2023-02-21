import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseCourseMaterialPage } from './choose-course-material.page';
import { ThanksPageComponent } from './course-rating/thanks-page/thanks-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseCourseMaterialPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseCourseMaterialPageRoutingModule {}
