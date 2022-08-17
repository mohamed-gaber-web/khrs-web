import { PipeSafeUrlPipe } from './../../shared/pipes/pipe-safe-url.pipe';

import { ReviewsComponent } from './reviews/reviews.component';
import { VideosComponent } from './videos/videos.component';
import { ImagesComponent } from './images/images.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessBoardPageRoutingModule } from './success-board-routing.module';

import { SuccessBoardPage } from './success-board.page';
import { SharedModule } from 'src/app/shared/shared.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessBoardPageRoutingModule,
    SharedModule,
    NgbModule,
  ],
  declarations: [SuccessBoardPage, ImagesComponent, VideosComponent, ReviewsComponent, PipeSafeUrlPipe]
})
export class SuccessBoardPageModule {}
