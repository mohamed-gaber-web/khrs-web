import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopHeaderDesktop } from './top-header-desktop/top-header-desktop.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { CategoryModule } from './components/category/category.module';

@NgModule({
  imports: [CommonModule, TopHeaderDesktop, RouterModule, CategoryModule],
  declarations: [NotFoundComponent],
  exports: [TopHeaderDesktop, CategoryModule],
  providers: [],
})

export class SharedModule {}
