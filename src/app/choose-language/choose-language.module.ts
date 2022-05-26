import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChooseLanguagePageRoutingModule } from './choose-language-routing.module';

import { ChooseLanguagePage } from './choose-language.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseLanguagePageRoutingModule,
    RouterModule,
  ],
  declarations: [ChooseLanguagePage]
})
export class ChooseLanguagePageModule {}
