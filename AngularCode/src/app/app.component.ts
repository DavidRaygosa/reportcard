import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { PushService } from './services/push.service';
declare let AOS: any;
declare let $: any;
import Typed from 'typed.js';
import Hammer from 'hammerjs';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService, CookieService, PushService]
})
export class AppComponent implements OnInit {
  title = 'Prepa114';

  auth:boolean = false; // AUTH BY JWT
  interval;

  public readonly VAPID_PUBLIC_KEY = 'BCsfxp91Jw3WDbuzIY0PyYYC6rugUyHP5PdKqEYpmF3xlZPDqscJgVjg-8H-Te_fOMCzc3dPXp855IHNMEG2kEw';

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
        if(this.auth){
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
          else if(this.count==0) {navbar.classList.add('d-none');navbar2.classList.add('d-none');this.responsive=true;}
          this.count++;
        }
        if(this.innerWidth>=992) {
          navbar.classList.remove('d-none');
          navbar2.classList.remove('d-none');
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
  }

  constructor(private router: Router, private cookieService: CookieService, private swPush:SwPush, private _pushService:PushService) {
    this.checkAuth();
    /* DISABLED PUSH NOTIFICATION
    if(this.auth) this.subscribeToNotification(); */
  }

  checkAuth(){
    if(this.cookieService.check('token')) this.auth = true;
    else if(!this.cookieService.check('token')){
      this.interval = setInterval(() =>{
        if(this.cookieService.check('token')) {
          this.auth = true; 
          clearInterval(this.interval); 
          setTimeout(() => {
            this.getScreenSize();
            this.hammerJS();
            this.startTyped(); 
          }, 1);
          /* DISABLED PUSH NOTIFICATION
          this.subscribeToNotification(); */
        }
      },500);
    } 
  }

  subscribeToNotification(){
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub =>{
      let data = JSON.parse(JSON.stringify(sub));
      this._pushService.savePush(data).subscribe(res =>{
        this._pushService.getPush().subscribe();
      });
    }).catch(err => console.error('UPS: '+err));
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

  ngOnInit() {
    // START AOS
    AOS.init();
    // START TYPED
    if(this.auth) this.startTyped();
    // GET ROUTE
    this.getRoute();
    // START PRINCIPAL FUNCTIONS
    if(this.auth){
      setTimeout(() => {
        this.getScreenSize();
        this.hammerJS();
      },1);
    }
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
      if(this.auth){
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

  hideLogin()
  {
    let loginPanel = document.getElementById('login');
    loginPanel?.classList.add('d-none');
  }

  closeSession()
  {
    let loginPanel = document.getElementById('login');
    loginPanel?.classList.remove('d-none');
    this.cookieService.deleteAll('token');
    this.auth = false;
    this.router.navigate(['/','login']);
    this.checkAuth();
  }

  startTyped()
  {
    setTimeout(() => {
      if ($('.typed-navbar').length) {
        var typed_strings = $(".typed-navbar").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typed-navbar', {
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