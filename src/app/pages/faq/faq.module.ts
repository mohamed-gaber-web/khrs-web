import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';


import { FaqPage } from './faq.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    MatExpansionModule,
    SharedModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
