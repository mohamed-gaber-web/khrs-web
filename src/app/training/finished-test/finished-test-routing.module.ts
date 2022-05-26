import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishedTestPage } from './finished-test.page';

const routes: Routes = [
  {
    path: '',
    component: FinishedTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishedTestPageRoutingModule {}
