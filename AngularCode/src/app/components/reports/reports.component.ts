import { Component, OnInit } from '@angular/core';
import { ExcelGeneralService } from '../../services/excelGeneral.service';
import { ExcelIndividualService } from '../../services/excelIndividual.service';
import { GroupService } from '../../services/group.service';
import { CounselorService } from '../../services/counselor.service';
import { TeacherService } from '../../services/teacher.service';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ExcelGeneralService, GroupService, CounselorService, ExcelIndividualService]
})
export class ReportsComponent implements OnInit {

  public AllGroups:any;
  public AllTeachers:any;
  public downloading_message:string = 'Inicializando...';
  public downloading:boolean = false;

  constructor(private _excelGeneralService:ExcelGeneralService, private _excelIndividualService:ExcelIndividualService, private _groupService:GroupService, private _counselorService:CounselorService, private _teacherService:TeacherService) { }

  ngOnInit(): void {
    this.startTyped();
  }

  // GENERAL REPORTS
  generateGeneralExcel(turn:string, pdf:boolean)
  {
    this.downloading = true;
    this.AllGroups = [];
    this.downloading_message = ''
    this._groupService.getGroups().subscribe((response:any) =>
    {
      response.documents.forEach((Element:any) =>
      {
        if(Element.turn == turn) this.AllGroups.push(Element);
      });  
      this.AllGroups.forEach((Element:any) => //MONDAY
      {
        if(Element.counselor != 'Orientador...') this._counselorService.getCounselorByID(Element.counselor).subscribe(response =>{if(response.document != null) Element.counselor=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem});
        Element.monday.forEach((TeacherMonday:any, Index:any) =>
        {
          if(TeacherMonday.teacher_id == '1') TeacherMonday.teacher_id = 'ORIENTACION';
          else if(TeacherMonday.teacher_id == '2') {TeacherMonday.teacher_id = '';TeacherMonday.subject = '';}
          else if(TeacherMonday.teacher_id != '2') this._teacherService.getTeacherByID(TeacherMonday.teacher_id).subscribe(response=>TeacherMonday.teacher_id=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem);
        });
      });
      this.AllGroups.forEach((Element:any) => //TUESDAY
      {
        Element.tuesday.forEach((TeacherTuesday:any) =>
        {
          if(TeacherTuesday.teacher_id == '1') TeacherTuesday.teacher_id = 'ORIENTACION';
          else if(TeacherTuesday.teacher_id == '2') {TeacherTuesday.teacher_id = '';TeacherTuesday.subject = '';}
          else if(TeacherTuesday.teacher_id != '2') this._teacherService.getTeacherByID(TeacherTuesday.teacher_id).subscribe(response=>TeacherTuesday.teacher_id=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem);
        });
      });    
      this.AllGroups.forEach((Element:any) => //WEDNESDAY
      {
        Element.wednesday.forEach((TeacherWednesday:any) =>
        {
          console.log(TeacherWednesday)
          if(TeacherWednesday.teacher_id == '1') TeacherWednesday.teacher_id = 'ORIENTACION';
          else if(TeacherWednesday.teacher_id == '2') {TeacherWednesday.teacher_id = '';TeacherWednesday.subject = '';}
          else if(TeacherWednesday.teacher_id != '2') this._teacherService.getTeacherByID(TeacherWednesday.teacher_id).subscribe(response=>TeacherWednesday.teacher_id=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem);
        });
      });
      this.AllGroups.forEach((Element:any) => //THURSDAY
      {
        Element.thursday.forEach((TeacherThursday:any) =>
        {
          if(TeacherThursday.teacher_id == '1') TeacherThursday.teacher_id = 'ORIENTACION';
          else if(TeacherThursday.teacher_id == '2') {TeacherThursday.teacher_id = '';TeacherThursday.subject = '';}
          else if(TeacherThursday.teacher_id != '2') this._teacherService.getTeacherByID(TeacherThursday.teacher_id).subscribe(response=>TeacherThursday.teacher_id=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem);
        });
      });
      this.AllGroups.forEach((Element:any) => //FRIDAY
      {
        Element.friday.forEach((TeacherFriday:any) =>
        {
          if(TeacherFriday.teacher_id == '1') TeacherFriday.teacher_id = 'ORIENTACION';
          else if(TeacherFriday.teacher_id == '2') {TeacherFriday.teacher_id = '';TeacherFriday.subject = '';}
          else if(TeacherFriday.teacher_id != '2') this._teacherService.getTeacherByID(TeacherFriday.teacher_id).subscribe(response=>TeacherFriday.teacher_id=response.document.name+' '+response.document.lastnamep+' '+response.document.lastnamem);
        }); 
      });
      this._excelGeneralService.generateExcel(this.AllGroups, pdf, turn);
      this._excelGeneralService.messageObservable().subscribe(response =>
        {
          if(response == 'Archivo Descargado') {this.downloading_message = '';this.downloading = false;} // IGUAL DEBE CERRAR MODAL
          this.downloading_message = response
        });
    });
  }

  generateIndividualExcel(turn:string, isPDF:boolean)
  {
    this.downloading = true;
    this.downloading_message = 'Inicializando...'
    this.AllTeachers = [];
    this._teacherService.getTeachers().subscribe((response : any) =>
      {
        response.documents.forEach((Element:any) =>
        {
          if(Element.turn == turn || Element.turn == 'AMBOS') this.AllTeachers.push(Element);
        });  
        this.AllTeachers.forEach((Teacher:any, TeacherIndex:any) =>
        {
          Teacher.groups.forEach((GroupData:any, GroupIndex:any) =>
          {
            this._groupService.getGroupByID(GroupData.id_group).subscribe(response =>
              {
                if(this.AllTeachers[TeacherIndex] != undefined || this.AllTeachers[TeacherIndex].groups[GroupIndex] != undefined || this.AllTeachers[TeacherIndex].groups[GroupIndex].id_group != undefined) this.AllTeachers[TeacherIndex].groups[GroupIndex].id_group = response.document.gen+'-'+response.document.group;
              });
          });
        });
        this._excelIndividualService.messageObservable().subscribe(response =>
          {
            if(response == 'Archivo Descargado') {this.downloading_message = '';this.downloading = false;} // IGUAL DEBE CERRAR MODAL
            this.downloading_message = response
          });
        setTimeout(() => {
          this._excelIndividualService.generateExcel(this.AllTeachers, isPDF, turn);
        }, 3000);
      });
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedReport').length) {
        var typed_strings = $(".typedReport").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedReport', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 50
        });
      }
    }, 1);
  }

}
