import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { emailValidator, matchingPasswords } from 'src/theme/app-validators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  forgetPasswordForm: FormGroup;

  forgetPasswordFormErrors = {
    Email: '',
    // Password: '',
    // confirmPassword: ''
  };

  forgetPasswordValidationMessages = {
    Email: {
      required: 'Email field is required',
      invalidEmail: 'Email field must be a valid email',
    },
    // Password: {
    //   required: 'Password field is required',
    // },
    // confirmPassword: {
    //   required: 'Confirm Password field is required',
    // },
  };

  constructor(public formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.buildForgetPasswordForm();
  }

  buildForgetPasswordForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      Email: ['', Validators.compose([Validators.required, emailValidator])],
      // Password: ['', Validators.required],
      // confirmPassword: ['', Validators.required],
    },
    // {validator: matchingPasswords('Password', 'confirmPassword')}

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
    console.log(this.forgetPasswordForm.value.Email);

    this.authService.resetPassword
    ( this.forgetPasswordForm.value.Email, 'http://localhost:8100/auth/forget-password')
    .subscribe(res => {
      console.log(res);
    })
  }

}
