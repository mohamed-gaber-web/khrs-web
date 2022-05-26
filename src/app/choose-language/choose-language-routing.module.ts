import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseLanguagePage } from './choose-language.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseLanguagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseLanguagePageRoutingModule {}
