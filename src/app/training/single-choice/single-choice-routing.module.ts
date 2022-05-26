import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleChoicePage } from './single-choice.page';

const routes: Routes = [
  {
    path: '',
    component: SingleChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleChoicePageRoutingModule {}
