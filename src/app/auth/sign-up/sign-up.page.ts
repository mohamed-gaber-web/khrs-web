import { UtilityService } from './../../shared/services/utility.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


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
  closeResult = '';
  termsAndConditionsText: any;
  isSelected: boolean = false;
  itemClass: string = '';
  selected: any;
  languageTitle: string = ''
  @ViewChild('signUpBtn', { read: ElementRef }) button: ElementRef;

  gender = [
    {name: 'male', value: 0},
    {name: 'female', value: 1}
  ]

  registerFormErrors = {
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    email: '',
    Birthdate: '',
    Nickname: '',
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
    LastName: {
      required: this.translate.instant('lastNameReq'),
    },
    phoneNumber: {
    required: this.translate.instant('phoneReq'),
    minlength: 'Phone Number is not long enough, minimum of 11 characters',
    },
    email: {
      required: this.translate.instant('emailReq'),
      invalidEmail: this.translate.instant('invalidEmail'),
    },
    Birthdate: {
      required: this.translate.instant('birthdateReq'),
    },
    Nickname: {
      required: 'Nickname is required',
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
  private utilitySer: UtilityService,
  private modalService: NgbModal
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
  this.getTermsAndConditionText();

  // get all language
  this.getLanguage();

  // * Register Fields
  this.registerForm = this.formBuilder.group({
    'FirstName': [''], // Validators.compose([Validators.required])
    'LastName': [''],
    'PhoneNumber': ['', Validators.compose([Validators.minLength(11)])],
    'email': [''],
    'Birthdate': [new Date()],
    'Nickname': ['', Validators.required],
    'Gender': [0 ],
    'password': [''],
    'confirmPassword': [''],
    'recommendedbyId': [0, Validators.required],
    'acceptTerms': [null],
    'languageId': [JSON.parse(localStorage.getItem('languageId'))],
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

    // console.log(this.registerForm.value)
    this.validateRegisterForm(true);
      this.getLanguageAPi(); // ** fix phone and gender in ios app
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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // ** get terms and conditions text
  getTermsAndConditionText() {
    this.auth.getTermsAndCondition()
      .subscribe(response => {
        this.termsAndConditionsText = response['result'];
        // console.log(response);
      })
  }
  
  // Modal
  openChooseLanguage(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;
    });
  }

  private getDismissReason2(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getLanguageId(item: any) {
    this.registerForm.patchValue({
      languageId: item.id
    })
    localStorage.setItem('languageId', item.id);
    this.selected = item;
    this.languageTitle = item.name;
    // console.log(item.name)
  }

  isActive(item) {return this.selected === item;};

  ngOnDestroy() {this.subs.forEach(e => e.unsubscribe())}

}
