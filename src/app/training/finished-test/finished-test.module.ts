import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishedTestPageRoutingModule } from './finished-test-routing.module';
import { FinishedTestPage } from './finished-test.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishedTestPageRoutingModule
  ],
  declarations: [FinishedTestPage]
})
export class FinishedTestPageModule {}
