import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseMaterialPage } from './course-material.page';

const routes: Routes = [
  {
    path: '',
    component: CourseMaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseMaterialPageRoutingModule {}
