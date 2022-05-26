import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleTestPage } from './single-test.page';

const routes: Routes = [
  {
    path: '',
    component: SingleTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleTestPageRoutingModule {}
