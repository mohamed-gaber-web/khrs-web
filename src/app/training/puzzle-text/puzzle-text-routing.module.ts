import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzleTextPage } from './puzzle-text.page';

const routes: Routes = [
  {
    path: '',
    component: PuzzleTextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzleTextPageRoutingModule {}
