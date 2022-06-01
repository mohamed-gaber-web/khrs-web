import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopHeaderDesktopComponent } from './top-header-desktop.component';

import { MatMenuModule } from '@angular/material/menu';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, RouterModule, MatMenuModule, IonicModule],
  declarations: [TopHeaderDesktopComponent],
  exports: [TopHeaderDesktopComponent],
  providers: [],
})

export class TopHeaderDesktop {}
