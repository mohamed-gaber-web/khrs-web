import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuzzleTextTestPageRoutingModule } from './puzzle-text-test-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PuzzleTextTestPageRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class PuzzleTextTestPageModule {}
