import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { emailValidator, matchingPasswords } from 'src/theme/app-validators';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  forgetPasswordForm: FormGroup;
  urlRequest: string = 'https://www.e-asylearn.dk/auth/new-password';

  forgetPasswordFormErrors = {
    Email: '',
  };

  forgetPasswordValidationMessages = {
    Email: {
      required: 'Email field is required',
      invalidEmail: 'Email field must be a valid email',
    },
  };

  constructor(
      public formBuilder: FormBuilder, 
      private authService: AuthService,
      private toastController: ToastController
      ) { }

  ngOnInit() {
    this.buildForgetPasswordForm();
  }

  buildForgetPasswordForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      Email: ['', Validators.compose([Validators.required, emailValidator])],
    },

    );

    this.forgetPasswordForm.valueChanges.subscribe((data) => this.validateForgetPasswordForm());
  }

  validateForgetPasswordForm(isSubmitting = false) {
    for (const field of Object.keys(this.forgetPasswordFormErrors)) {
      this.forgetPasswordFormErrors[field] = '';

      const input = this.forgetPasswordForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.forgetPasswordFormErrors[field] = this.forgetPasswordValidationMessages[field][
            error
          ];
        }
      }
    }
  }

  onResetPassword() {
    const resetObj = {
      email: this.forgetPasswordForm.value.Email,
      callbackUrl: this.urlRequest
    }

    this.authService.resetPassword(this.forgetPasswordForm.value.Email, this.urlRequest)
    .subscribe(async(res) => {
      if(res) {
        const toast = await this.toastController.create({
          message: 'Please check email',
          duration: 1500,
          position: 'top',
          cssClass: 'reset-toast',
        });
    
        await toast.present();
      }
    })
  }

}
