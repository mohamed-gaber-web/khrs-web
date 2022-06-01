import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessBoardPage } from './success-board.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessBoardPageRoutingModule {}
