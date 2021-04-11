import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
declare let AOS: any;
declare let $: any;
import Typed from 'typed.js';
import Hammer from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'Prepa114';

  public isLogged: boolean = false;
  public isLogging: boolean = false;
  public loginError: boolean = false;
  public responsive: boolean = false;
  public innerWidth: any;
  public count:number = 0;
  public openedNavBar:boolean = false;
  // LOGIN
  @ViewChild('loginUser') loginUser:any;
  @ViewChild('loginPassword') loginPassword:any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.innerWidth = window.innerWidth;
        let navbar:any = document.getElementById('navbarResponsive');
        let navbar2:any = document.getElementById('nav-dashboard');
        if(this.innerWidth<992){
          if(this.count>0)
          {
            if(!this.responsive)
            {
              $('.hideNavbar').animate({
                right: '100%',
              },300,'linear');
              this.responsive=true;
            }
          }
          else if(this.count==0) {if(this.isLogged) navbar.classList.add('d-none');if(this.isLogged) navbar2.classList.add('d-none');this.responsive=true;}
          this.count++;
        }
        if(this.innerWidth>=992) {
          if(this.isLogged) navbar.classList.remove('d-none');
          if(this.isLogged) navbar2.classList.remove('d-none');
          if(this.count>0)
          {
              if(this.responsive)  
              {
                $('.hideNavbar').animate({
                  right: '0px',
                  left: '0px'
                },300,'linear',function () { $('.hideNavbar').removeAttr('style'); });
                this.responsive=false;
              }
          }     
          this.count++;
        }
  }

  openNavBar()
  {
    if(!this.openedNavBar)
    {
      let navbar:any = document.getElementById('navbarResponsive');
      let navbar2:any = document.getElementById('nav-dashboard');
      this.responsive=true;
      $('.hideNavbar').animate({
        right: '100%',
      },1,'linear');
      navbar.classList.remove('d-none');
      navbar2.classList.remove('d-none');
      $('.hideNavbar').animate({
        right: '0px',
        left: '0px'
      },300,'linear',function () { $('.hideNavbar').removeAttr('style'); });
      $('.responsiveNavbar').animate({
        left: '85%',
      },300,'linear');
      this.openedNavBar = true;
    }
    else if(this.openedNavBar) this.closeNavBar();
  }

  closeNavBar()
  {
    if(this.innerWidth<992){
      if(this.openedNavBar)
      {
        $('.hideNavbar').animate({
          right: '100%',
        },300,'linear');
        $('.responsiveNavbar').animate({
          right: '0px',
          left: '0px'
        },300,'linear',function () { $('.responsiveNavbar').removeAttr('style'); });
        this.openedNavBar = false;
      }
    }
  }

  constructor(private router: Router, private _userService: UserService) {
  }

  ngOnInit() {
    // START AOS
    AOS.init();
    // START TYPED
    this.startTyped();
    // GET ROUTE
    this.getRoute();
  }

  hammerJS()
  {
    let myElement = document.getElementById('panel-dashboard');
    let mc = new Hammer(myElement);
    mc = new Hammer(myElement);
    mc.on("panright tap", (ev) => {
      if(ev.type == 'panright') if(ev.isFinal) if(this.responsive) this.openNavBar();
      if(ev.type == 'tap') if(this.openedNavBar) if(ev.isFinal) if(this.responsive) this.closeNavBar();
    });
  }

  getRoute() {
    setInterval(() => {
    if (this.isLogged) {
      //if(!this.openedNavBar) this.closeNavBar();
        this.router.url;
        let teachers = document.getElementById("teacher-nav") as HTMLSelectElement;
        let groups = document.getElementById("groups-nav") as HTMLSelectElement;
        let counselor = document.getElementById("counselor-nav") as HTMLSelectElement;
        let report = document.getElementById("report-nav") as HTMLSelectElement;
        let settings = document.getElementById("settings-nav") as HTMLSelectElement;
        teachers.classList.remove("nav-selected");
        groups.classList.remove("nav-selected");
        counselor.classList.remove("nav-selected");
        report.classList.remove("nav-selected");
        settings.classList.remove("nav-selected");
        if(this.router.url != '/')
        {
          if (this.router.url == '/profesores') teachers.classList.add("nav-selected");
          if (this.router.url == '/grupos') groups.classList.add("nav-selected");
          if (this.router.url == '/orientadores') counselor.classList.add("nav-selected");
          if (this.router.url == '/reportes') report.classList.add("nav-selected");
          if (this.router.url == '/ajustes') settings.classList.add("nav-selected");
        } 
      }
    }, 50);
  }

  onSubmit(event: any) {
    this.loginError = false;
    this.isLogging = true;
    this._userService.checkLogin(event.target.userName.value).subscribe(
      (response: any) => {
        if (response.message != 'No Hay Proyectos Para Mostrar') { 
          if (response.user[0].user == event.target.userName.value && response.user[0].password == event.target.userPassword.value) {  
            this.isLogged = true;
            this.isLogging = true;
            this.startTyped2();
            this.count=0;
            this.hideLogin();
            setTimeout(() => {
              this.getScreenSize();
              this.hammerJS();
              this.startTyped();
            },1);
          } 
          else{
            this.loginError = true;
            this.isLogging = false;
          }
        }
        else {
          this.loginError = true;
          this.isLogging = false;
        }
        return false;
      });
  }

  hideLogin()
  {
    let loginPanel = document.getElementById('login');
    loginPanel?.classList.add('d-none');
  }

  closeSession()
  {
    this.isLogged = false;
    this.isLogging = false;
    let loginPanel = document.getElementById('login');
    loginPanel?.classList.remove('d-none');
    this.loginUser.nativeElement.value = '';
    this.loginPassword.nativeElement.value = '';
    this.ngOnInit();
  }

  startTyped2()
  {
    setTimeout(() => {
      if ($('.typed2').length) {
        var typed_strings = $(".typed2").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typed2', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }, 1);
  }

  startTyped() {
    setTimeout(() => {
      if ($('.typed').length) {
        var typed_strings = $(".typed").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typed', {
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