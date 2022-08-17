import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route} from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canLoad(route: Route): boolean {

    if (this.authService.IsLoggedIn) {
      this.router.navigate(['/courses'])
      return true;
    } else {
      this.router.navigate(['/choose-language']);
      return false;
    }
  }

}
