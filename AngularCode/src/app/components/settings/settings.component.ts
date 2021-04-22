import { Component, OnInit, ViewChild } from '@angular/core';
import { LogosService } from '../../services/logos.services';
import { GeneralService } from '../../services/general.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { TeacherService } from '../../services/teacher.service';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [LogosService, GeneralService, UserService, GroupService, TeacherService]
})
export class SettingsComponent implements OnInit {

  // LOGIN
  public loginSettings:boolean = false;
  public validCredentialUser:string = '';
  public validCredentialPassword:string = '';
  public loginMessageError:string = '';
  public loginError:boolean = false;
  // LOGOS
  public file:any;
  public logos:any;
  public loading:boolean = true;
  public leftHeader:any;
  public rightHeader:any;
  public footer:any;
  public logo:any;
  public leftHeaderFileName:string = 'Seleccionar...';
  public righteaderFileName:string = 'Seleccionar...';
  public footerFileName:string = 'Seleccionar...';
  public logoFileName:string = 'Seleccionar...';
  // ERROR
  public error:boolean = false;
  public error_message:string = '';
  // SUCCESS
  public success:boolean = false;
  public success_message:string = '';
  // DATABASE PANEL
  public selectedTable:string = '';
  public generalInfo:any;
  public credentialUser:string = '';
  public credentialPassword:string = '';
  public dropError:boolean = false;
  public dropMessageError:string = '';
  @ViewChild('closeDropModal') closeDropModal:any;
  
  constructor(private _logosService:LogosService, private _generalService:GeneralService, private _userService:UserService, private _groupService:GroupService, private _teacherService:TeacherService) 
  { }

  ngOnInit(): void {
    this.startTyped();
    this.getLogos();
    this.getTitleDocument();
  }

  login()
  {
    this.loginMessageError = '';
    this.loginError = false;
    if(this.validCredentialUser == '' || this.validCredentialPassword == '') {this.loginMessageError = 'Porfavor llene todos los campos';this.loginError = true;}
    else if(this.validCredentialUser != '' && this.validCredentialPassword != '')
    {
      this._userService.checkLogin(this.validCredentialUser).subscribe((response:any) =>
        {
          if(response.message == 'No Hay Proyectos Para Mostrar') {this.loginMessageError = 'Usuario y/o Contraseña Incorrectos';this.loginError = true;}
          else
          {
            if(response.user[0].user == this.validCredentialUser && response.user[0].password == this.validCredentialPassword) this.loginSettings = true;
            else if(response.user[0].user != this.validCredentialUser || response.user[0].password != this.validCredentialPassword) {this.loginMessageError = 'Usuario y/o Contraseña Incorrectos';this.loginError = true;}
          }
        });
    }
  }

  /*-------------------------------------------------------------------------------------------------
  ------------------------------------------ LOGOS --------------------------------------------------
  ---------------------------------------------------------------------------------------------------*/
  getLogos()
  {
    this._logosService.getLogos().subscribe((response:any) =>
    {
      this.logos = response.documents;
      this.loading = false;
      this.logos.forEach((Element:any) =>
      {
        if(Element.name == 'logoBase64_gob') this.leftHeader = Element.base64;
        if(Element.name == 'logoBase64_title') this.rightHeader = Element.base64;
        if(Element.name == 'logoBase64_footer') this.footer = Element.base64;
        if(Element.name == 'logoBase64_logo') this.logo = Element.base64;
      });
    });
  }

  fileChangeEvent(file:any, inputSelected:string)
  {
    if(this.isValidFile(file.target.files[0].name))
    {
      if(inputSelected == 'leftHeader') this.leftHeaderFileName = file.target.files[0].name;
      if(inputSelected == 'rightHeader') this.righteaderFileName = file.target.files[0].name;
      if(inputSelected == 'footer') this.footerFileName = file.target.files[0].name;
      if(inputSelected == 'logo') this.logoFileName = file.target.files[0].name;
      this.file = file.target.files[0];
    }
    else if(!this.isValidFile(file.target.files[0].name))
    {
      if(inputSelected == 'leftHeader') this.leftHeaderFileName = 'Seleccionar...';
      if(inputSelected == 'rightHeader') this.righteaderFileName = 'Seleccionar...';
      if(inputSelected == 'footer') this.footerFileName = 'Seleccionar...';
      if(inputSelected == 'logo') this.logoFileName = 'Seleccionar...';
      this.showError('Solo permite archivos "png, jpg, jpeg"');
    }
  }

  isValidFile(filePath:any)
  {
    let extSplit = filePath.split('.');
    let fileExt = extSplit[1];
    if(fileExt=='png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt=='PNG' ||fileExt=='JPG' ||fileExt=='JPEG') return true;
    return false;
  }

  onSubmit(inputSelected:string)
  {
    if(this.isEmpty(inputSelected)) this.updateBase64(inputSelected);
    else if(!this.isEmpty(inputSelected)) this.showError('Primero seleccione un archivo');
  }

  isEmpty(inputSelected:string)
  {
    if(inputSelected == 'leftHeader') if(this.leftHeaderFileName != 'Seleccionar...') return true;
    if(inputSelected == 'rightHeader') if(this.righteaderFileName != 'Seleccionar...') return true;
    if(inputSelected == 'footer') if(this.footerFileName != 'Seleccionar...') return true;
    if(inputSelected == 'logo') if(this.logoFileName != 'Seleccionar...') return true;
    return false;
  }

  updateBase64(inputSelected:string)
  {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      let Base64 = reader.result?.toString();
      let extSplit:any;
      let fileExt:any;
      if(typeof Base64 == 'string') extSplit = Base64.split(',');
      fileExt = extSplit[1];
      this.updateLogo(inputSelected, fileExt);
    };
  }

  updateLogo(inputSelected:string, fileExt:any)
  {
    this.logos.forEach((Element:any) =>
    {
      if(inputSelected == 'leftHeader') if(Element.name == 'logoBase64_gob') {Element.base64=fileExt;this._logosService.updateLogo(Element).subscribe(response => this.showSuccess('Logo Exitosamente Cambiado'));}
      if(inputSelected == 'rightHeader') if(Element.name == 'logoBase64_title') {Element.base64=fileExt;this._logosService.updateLogo(Element).subscribe(response => this.showSuccess('Logo Exitosamente Cambiado'));}
      if(inputSelected == 'footer') if(Element.name == 'logoBase64_footer') {Element.base64=fileExt;this._logosService.updateLogo(Element).subscribe(response => this.showSuccess('Logo Exitosamente Cambiado'));}
      if(inputSelected == 'logo') if(Element.name == 'logoBase64_logo') {Element.base64=fileExt;this._logosService.updateLogo(Element).subscribe(response => this.showSuccess('Logo Exitosamente Cambiado'));}
    });
    this.ChangeAndResetInputLogo(inputSelected, fileExt);
  }

  ChangeAndResetInputLogo(inputSelected:string, fileExt:any)
  {
    if(inputSelected == 'leftHeader') {this.leftHeader = fileExt; this.leftHeaderFileName = 'Seleccionar...';}
    if(inputSelected == 'rightHeader') {this.rightHeader = fileExt; this.righteaderFileName = 'Seleccionar...';}
    if(inputSelected == 'footer') {this.footer = fileExt; this.footerFileName = 'Seleccionar...';}
    if(inputSelected == 'logo') {this.logo = fileExt; this.logoFileName = 'Seleccionar...';}
  }

  /*-------------------------------------------------------------------------------------------------
  ------------------------------------------ DATA BASE -----------------------------------------------
  ---------------------------------------------------------------------------------------------------*/

  getTitleDocument()
  {
    this._generalService.getGeneral().subscribe(response=>this.generalInfo=response.documents[0]);
  }

  onSubmitTitle(form:any)
  {
    this.generalInfo.documents_title = form.value.title;
    this._generalService.updateGeneral(this.generalInfo).subscribe(response => this.showSuccess('Titulo exitosamente actualizado'));
  }

  dropTable(table:string)
  {
    this.selectedTable = table;
    this.clearModalDrop();
  }

  onSubmitDrop()
  {
    if(this.selectedTable == 'groups')
    {
      this.dropMessageError = '';
      this.dropError = false;
      if(this.credentialUser == '' || this.credentialPassword == '') {this.dropMessageError = 'Porfavor llene todos los campos';this.dropError = true;}
      else if(this.credentialUser != '' && this.credentialPassword != '')
      {
        this._userService.checkLogin(this.credentialUser).subscribe((response:any) =>
          {
            if(response.message == 'No Hay Proyectos Para Mostrar') {this.dropMessageError = 'Usuario y/o Contraseña Incorrectos';this.dropError = true;}
            else
            {
              if(response.user[0].user == this.credentialUser && response.user[0].password == this.credentialPassword) this.drop(this.selectedTable);
              else if(response.user[0].user != this.credentialUser || response.user[0].password != this.credentialPassword) {this.dropMessageError = 'Usuario y/o Contraseña Incorrectos';this.dropError = true;}
            }
          });
      }
    }
  }

  drop(table:string)
  {
    // CALL ALL GROUPS AND RESET IT BY DAY AND COUNSELOR
    this._groupService.getGroups().subscribe((response:any) =>
      {
        let groups = response.documents;
        groups.forEach((Group:any) =>
        {
          Group.monday = [];
          Group.tuesday = [];
          Group.wednesday = [];
          Group.thursday = [];
          Group.friday =[];
          Group.counselor = '';
          // CALL UPDATE GROUPS API
          this._groupService.updateGroup(Group).subscribe();
        });
        // CALL ALL TEACHER AND RESET IT BY GROUPS
        this._teacherService.getTeachers().subscribe((response:any) =>
          {
            let teachers = response.documents;
            teachers.forEach((Teacher:any) =>
            {
              Teacher.groups = [];
              // CALL UPDATE TEACHERS API
              this._teacherService.updateTeacher(Teacher).subscribe();
            });
            // CLOSE DROP MODAL
            this.closeModals('dropped');
          });
      });
  }

  clearModalDrop()
  {
    this.credentialUser = '';
    this.credentialPassword = '';
    this.dropMessageError = '';
    this.dropError = false;
  }

  /*-------------------------------------------------------------------------------------------------
  ------------------------------------------ MODALS --------------------------------------------------
  ---------------------------------------------------------------------------------------------------*/

  showSuccess(message:string)
  {
    this.success = true;
    this.success_message = message;
    setTimeout(() => {
      this.success = false;
    }, 5000);
  }

  showError(message:string)
  {
    this.error = true;
    this.error_message = message;
    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  closeModals(reason:string)
  {
    this.closeDropModal.nativeElement.click();
    if(reason == 'dropped') this.showSuccess('Tarea realizada exitosamente');
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedSettings').length) {
        var typed_strings = $(".typedSettings").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedSettings', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 50
        });
      }
    }, 1);
  }

}
