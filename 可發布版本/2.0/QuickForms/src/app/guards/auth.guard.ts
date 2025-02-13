import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // 儲存當前URL，登入後可以重定向回來
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}
