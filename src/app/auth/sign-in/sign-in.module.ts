import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInPageRoutingModule } from './sign-in-routing.module';

import { SignInPage } from './sign-in.page';
import { TranslateModule } from '@ngx-translate/core';

import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignInPageRoutingModule,
    TranslateModule,
    MatTooltipModule

  ],
  declarations: [SignInPage]
})
export class SignInPageModule {}
