import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleChoicePageRoutingModule } from './single-choice-routing.module';

import { SingleChoicePage } from './single-choice.page';
import { HelpModalModule } from '../help-modal/help-modal.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChoicePageRoutingModule,
    ReactiveFormsModule,
    HelpModalModule,
    SharedModule

  ],
  declarations: [SingleChoicePage],
})
export class SingleChoicePageModule {}
