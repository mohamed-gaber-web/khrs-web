import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopScoresPage } from './top-scores.page';

const routes: Routes = [
  {
    path: '',
    component: TopScoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopScoresPageRoutingModule {}
