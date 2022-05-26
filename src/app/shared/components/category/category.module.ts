import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { IonicModule } from '@ionic/angular';
import { CategoryComponent } from './category.component';


@NgModule({
  imports: [CommonModule, RouterModule, MatMenuModule, IonicModule],
  declarations: [CategoryComponent],
  exports: [CategoryComponent],
  providers: [],
})

export class CategoryModule {}
