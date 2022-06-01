import { TopMenuMobileComponent } from './components/top-menu-mobile/top-menu-mobile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopHeaderDesktop } from './components/top-header-desktop/top-header-desktop.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { CategoryModule } from './components/category/category.module';

import { MatMenuModule } from '@angular/material/menu';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, TopHeaderDesktop, RouterModule, CategoryModule, IonicModule, MatMenuModule],
  declarations: [NotFoundComponent, TopMenuMobileComponent],
  exports: [TopHeaderDesktop, CategoryModule, TopMenuMobileComponent],
  providers: [],
})

export class SharedModule {}
