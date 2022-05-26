import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { emailValidator, matchingPasswords } from 'src/theme/app-validators';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  userInfoForm: FormGroup;
  subs: Subscription[] = [];
  gender = [
    {name: 'male', value: 0},
    {name: 'female', value: 1}
  ];
  userInfo: any;

  userInfoFormErrors = {
    FirstName: '',
    LastName: '',
    email: '',
    PhoneNumber: '',
    Birthdate: '',
    Gender: '',
  };

  userInfodValidationMessages = {
    FirstName: {
      required: this.translate.instant('firstNameReq'),
    },
    LastName: {
      required: this.translate.instant('lastNameReq'),
    },
    email: {
      required: this.translate.instant('emailReq'),
      invalidEmail: this.translate.instant('invalidEmail'),
    },
    phoneNumber: {
      required: this.translate.instant('phoneReq'),
      minlength: 'Phone Number is not long enough, minimum of 11 characters',
    },
    gender: {
      required: this.translate.instant('genderReq'),
    },
    Birthdate: {
      required: this.translate.instant('birthdateReq'),
    },

  };

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public storageService: StorageService,
    private router: Router,
    private translate:TranslateService,
  ) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.buldingForm();
  }

  buldingForm() {

    this.userInfoForm = this.formBuilder.group({
      'FirstName': [this.userInfo.firstname, Validators.compose([Validators.required])],
      'LastName': [this.userInfo.lastname, Validators.compose([Validators.required])],
      'email': [this.userInfo.email, Validators.compose([Validators.required, emailValidator])],
      'PhoneNumber': [this.userInfo.phoneNumber, Validators.compose([Validators.minLength(11), Validators.required])],
      'Gender': [ this.userInfo.gender,Validators.required],
      'birthdate': [new Date(), Validators.compose([Validators.required])],
      'file': null
    });

    // this.userInfoForm.valueChanges.subscribe((data) => this.validateChangeInfoForm());
  }

  // validateChangeInfoForm(isSubmitting = false) {
  //   for (const field of Object.keys(this.userInfoFormErrors)) {
  //     this.userInfoFormErrors[field] = '';

  //     const input = this.userInfoForm.get(field) as FormControl;
  //     if (input.invalid && (input.dirty || isSubmitting)) {
  //       for (const error of Object.keys(input.errors)) {
  //         this.userInfoFormErrors[field] = this.userInfodValidationMessages[field][
  //           error
  //         ];
  //       }
  //     }
  //   }
  // }

  updatedUserInfo() {
    // if (this.userInfoForm.invalid) {
    //   return;
    // }

    this.subs.push(

      this.authService.updatedUserProfile(this.userInfoForm.value).subscribe(async (response) => {

        console.log(response);


        if (response['success'] === true) {


        // ** set localstorage [ token ]
        this.storageService.setAccessToken( response['result']);

        this.buldingForm()

        var toast = await this.toastController.create({
          message: 'Update User Successful!',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.router.navigate(['/auth/user-profile']);

      } else {
        var toast = await this.toastController.create({
          message: response['arrayMessage'][0],
          duration: 2000,
          color: 'danger',
        });
        toast.present();
        this.router.navigate(['/auth/user-profile/edit-user']);

      }

    })
    );

  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
