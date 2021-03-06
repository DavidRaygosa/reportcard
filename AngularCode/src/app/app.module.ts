import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { routing, appRoutingProviders } from './app.routing';
import { JwtInterceptorInterceptor } from './jwt-interceptor.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { IndexComponent } from './components/index/index.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupTemplateComponent } from './components/group-template/group-template.component';
import { CounselorComponent } from './components/counselor/counselor.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';

import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    TeachersComponent,
    IndexComponent,
    GroupsComponent,
    GroupTemplateComponent,
    CounselorComponent,
    ReportsComponent,
    SettingsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    routing,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [appRoutingProviders, CookieService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
