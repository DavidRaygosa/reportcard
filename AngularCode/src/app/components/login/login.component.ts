import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService, CookieService]
})
export class LoginComponent implements OnInit {

  
  loginError: boolean = false;
  isLogging: boolean = false;

  constructor(private router: Router, private _userService: UserService, private cookieService: CookieService) { 
  }

  ngOnInit(): void {
    this.startTyped();
  }

  onSubmit(event: any) {

    this.loginError = false;
    let user = {
      user: event.target.userName.value,
      password: event.target.userPassword.value
    }
    this._userService.Login(user).subscribe(
      (response: any) => {
        if(response.message == 'No Hay Proyectos Para Mostrar') this.loginFailed();
        if(response.message == 'Invalid Validation') this.loginFailed();
        if(response.token != '') this.login(response.token)
      });

  }

  login(token){
    this.cookieService.set('token', token);
    this.router.navigate(['/','']);
  }

  loginFailed(){
    this.loginError = true;
    this.isLogging = false;
  }

  startTyped() {
    setTimeout(() => {
      if ($('.typed-login').length) {
        var typed_strings = $(".typed-login").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typed-login', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }, 1);
  }
}
