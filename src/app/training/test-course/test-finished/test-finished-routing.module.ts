import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestFinishedPage } from './test-finished.page';

const routes: Routes = [
  {
    path: '',
    component: TestFinishedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestFinishedPageRoutingModule {}
