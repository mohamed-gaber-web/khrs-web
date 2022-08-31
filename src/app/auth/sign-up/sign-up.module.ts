import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SignUpPage } from './sign-up.page';

import {NgxMatFileInputModule} from '@angular-material-components/file-input';

import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    NgxMatFileInputModule,
    TranslateModule,
    MatInputModule,
    HttpClientModule,
    SharedModule

  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
