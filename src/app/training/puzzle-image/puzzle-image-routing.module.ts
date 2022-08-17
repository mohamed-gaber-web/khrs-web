import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzleImagePage } from './puzzle-image.page';

const routes: Routes = [
  {
    path: '',
    component: PuzzleImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzleImagePageRoutingModule {}
