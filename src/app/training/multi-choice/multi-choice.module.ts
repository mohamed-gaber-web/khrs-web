import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpModalModule } from '../help-modal/help-modal.module';


import { IonicModule } from '@ionic/angular';

import { MultiChoicePageRoutingModule } from './multi-choice-routing.module';

import { MultiChoicePage } from './multi-choice.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiChoicePageRoutingModule,
    ReactiveFormsModule,
    HelpModalModule,
    SharedModule
  ],
  declarations: [MultiChoicePage]
})
export class MultiChoicePageModule {}
