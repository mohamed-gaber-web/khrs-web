import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { matchingPasswords } from 'src/theme/app-validators';
import { AuthService } from '../auth.service';

import { Subscription } from 'rxjs';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  userInfo: any;
  passwordForm: FormGroup;
  subs: Subscription[] = [];
  userDataList: any;
  isLoading: boolean = false;

  passwordFormErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  passwordValidationMessages = {
    currentPassword: {
      required: 'Current password field is required',
    },
    newPassword: {
      required: 'New password field is required',
    },
    confirmPassword: {
      required: 'Confirm password field is required',
    },
  };

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public storageService: StorageService,
    private router: Router
    ) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    console.log(this.userInfo)
    this.getProfileDataList();
    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmPassword')});

    this.passwordForm.valueChanges.subscribe((data) => this.validateChangePasswordForm());
  }

  validateChangePasswordForm(isSubmitting = false) {
    for (const field of Object.keys(this.passwordFormErrors)) {
      this.passwordFormErrors[field] = '';

      const input = this.passwordForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.passwordFormErrors[field] = this.passwordValidationMessages[field][
            error
          ];
        }
      }
    }
  }


  updatedPassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.subs.push(

      this.authService.updatedPassword(this.passwordForm.value).subscribe(async (response) => {

        if (response['success'] === true) {
        var toast = await this.toastController.create({
          message: 'You password is changed!',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.storageService.clearStorage();
        this.router.navigate(['/auth/sign-in']);
      } else {
        var toast = await this.toastController.create({
          message: response['arrayMessage'][0],
          duration: 2000,
          color: 'danger',
        });
        toast.present();
        this.router.navigate(['/auth/user-profile']);

      }

    })
    );

  }

  goToEditUser() {
    this.router.navigate(['/auth/user-profile/edit-user']);
  }

  getProfileDataList() {
    this.isLoading = true;
    this.authService.getProfileDataList()
    .subscribe(response => {
      console.log(response);
      this.isLoading = false;
      this.userDataList = response['result'];
    })
  }

  ngOnDestroy() {
      this.subs.forEach((sub) => sub.unsubscribe());
  }

}
