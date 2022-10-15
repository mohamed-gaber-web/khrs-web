import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  resetPassword: FormGroup;
  email: string;
  token: string;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.resetPassword = this.fb.group({
      newPassword: ['', Validators.required]
    })

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    })
  }

  onResetPassword() {
    this.auth.addNewPassword(this.email, this.resetPassword.value.newPassword, this.token)
    .subscribe(res => {
      console.log(res)
      if(res) {
        this.router.navigateByUrl('auth/sign-in');
      }
    })
  }

}
