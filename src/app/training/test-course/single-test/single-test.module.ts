import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleTestPageRoutingModule } from './single-test-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleTestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class SingleTestPageModule {}
