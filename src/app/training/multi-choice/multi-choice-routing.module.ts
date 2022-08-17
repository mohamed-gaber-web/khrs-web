import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiChoicePage } from './multi-choice.page';

const routes: Routes = [
  {
    path: '',
    component: MultiChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiChoicePageRoutingModule {}
