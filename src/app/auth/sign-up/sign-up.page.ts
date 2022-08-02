import { UtilityService } from './../../shared/services/utility.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { matchingPasswords } from 'src/theme/app-validators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { AppService } from 'src/app/shared/services/app.service';

import { Subscription, Observable, fromEvent} from 'rxjs';
import { scan, throttleTime } from 'rxjs/operators';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  registerForm: FormGroup;
  isLoading = false;
  toggleInputs: any;
  showPasswordItem: boolean = false;
  allRecommended: any = [];
  progress: number = 0;
  langItems: any;
  subs: Subscription[] = [];
  click$: Observable<any>;
  disabledBtn: boolean = true;
  @ViewChild('signUpBtn', { read: ElementRef }) button: ElementRef;

  gender = [
    {name: 'male', value: 0},
    {name: 'female', value: 1}
  ]

  registerFormErrors = {
    FirstName: '',
    LastName: '',
    Nickname: '',
    email: '',
    PhoneNumber: '',
    Birthdate: '',
    Gender: '',
    password: '',
    confirmPassword: '',
    recommendedbyId: '',
    languageId: '',
    acceptTerms: '',
  };

  registerValidationMessages = {
    FirstName: {
      required: this.translate.instant('firstNameReq'),
    },
    Nickname: {
      required: 'Nickname is required',
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
    password: {
      required: this.translate.instant('passwordReq'),
    },
    confirmPassword: {
      required: this.translate.instant('confirmPasswordReq'),
    },
    recommendedbyId: {
      required: this.translate.instant('firstNameReq'),
    },
    Birthdate: {
      required: this.translate.instant('birthdateReq'),
    },
    languageId: {
      required: 'Langauge is required',
    },
    acceptTerms: {
      required: this.translate.instant('acceptTermsReq'),
    }
  };


constructor(
  private auth: AuthService,
  private translate:TranslateService,
  public formBuilder: FormBuilder,
  public toastController: ToastController,
  public router: Router,
  private helpers: HelpersService,
  private appService: AppService,
  private utilitySer: UtilityService
  ) {}

  async uploadImg(event) {
    const imgString: any = await this.helpers.toBase64(event.target.files[0]);
    (this.registerForm.get('file') as FormGroup).patchValue({
      fieldName: 'image',
      filename: event.target.files[0].name,
      fileExtension: this.helpers.getExtension(event.target.files[0].name),
      fileData: this.helpers.validBase64(imgString),
    });
  }

  ngOnInit() {
  this.getLanguageAPi();
  this.getRecommendeBy();

  // get all language
  this.getLanguage()

  // * Register Fields
  this.registerForm = this.formBuilder.group({
    'FirstName': [''], // Validators.compose([Validators.required])
    'LastName': [''],
    'Nickname': [''],
    'email': [''],
    'PhoneNumber': ['', Validators.compose([Validators.minLength(11)])],
    'Birthdate': [new Date()],
    'Gender': [0 ],
    'password': [''],
    'confirmPassword': [''],
    'recommendedbyId': [0],
    'acceptTerms': [null],
    'languageId': [null, Validators.required],
    file : this.formBuilder.group({
      fieldName: ['', !Validators.required],
      filename: ['', !Validators.required],
      fileExtension: ['', !Validators.required],
      fileData: ['', !Validators.required],
    }),
  },{validator: matchingPasswords('password', 'confirmPassword')});

  this.registerForm.valueChanges.subscribe((data) => this.validateRegisterForm());
  }

  validateRegisterForm(isSubmitting = false) {
    for (const field of Object.keys(this.registerFormErrors)) {
      this.registerFormErrors[field] = '';

      const input = this.registerForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.registerFormErrors[field] = this.registerValidationMessages[field][
            error
          ];
        }
      }
    }
  }

  // ** Register New User
  public onRegisterFormSubmit(values):void {

    this.validateRegisterForm(true);
      // this.getLanguageAPi(); // ** fix phone and gender in ios app
        // ** check if lang is not exist in localstorage add lang
        if(!localStorage.getItem('languageId')) {
          localStorage.setItem('languageId', this.registerForm.value.languageId);
        }

        if (this.registerForm.valid) {
          this.auth.registerCustomer(values)
            .subscribe((response) => {
            if(response['success']) {
              this.utilitySer.successText('You signed up successfully!')
              setTimeout(() => {
                this.router.navigate(['/auth/sign-in']);
              }, 3000)

            } else {
              response['arrayMessage'].forEach((element) => {
                this.utilitySer.errorText(element)
              });
            }

          });
        }
    }

  // ** get Recomended By List
  getRecommendeBy() {
    this.auth.recommendedBy().subscribe(response => {
      const data = response['result'];
      data.forEach(rec => {
        this.allRecommended.push(rec);
      });
    })
  }

  // ** Get All Language
  getLanguage() {
    this.subs.push(
      this.appService.getLanguage()
      .subscribe(response => {
        // console.log(response)
        this.langItems = response['result'].result;
      })
    );
  }

  // ** fix phone and gender in ios app
  getLanguageAPi() {
    this.appService.getLanguage().subscribe(response => this.toggleInputs = response['flagSetting'])
  }

  // * Show And Hide Input Password
  showPassword() {
    this.showPasswordItem = !this.showPasswordItem
  }

  // ngAfterViewInit() {

  //   this.click$ = fromEvent(this.button.nativeElement, 'click');

  //   this.click$.pipe(
  //     throttleTime(2000),
  //     scan(count => {
  //       console.log(count)
  //       if(count === 3) {
  //         this.disabledBtn = false;
  //       }
  //       return count + 1
  //     }, 1)
  //   )
  //   .subscribe(count => console.log(`Clicked ${count} times`));
  // }

  ngOnDestroy() {
    this.subs.forEach(e => e.unsubscribe())
  }

}
