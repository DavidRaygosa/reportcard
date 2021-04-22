import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { GroupModel } from '../../models/group.model';
import { TeacherService } from '../../services/teacher.service';
import { CounselorService } from '../../services/counselor.service'
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-group-template',
  templateUrl: './group-template.component.html',
  styleUrls: ['./group-template.component.scss'],
  providers: [GroupService, TeacherService, CounselorService]
})
export class GroupTemplateComponent implements OnInit {

  public group: any;
  public loading: boolean = true;
  public firstload: boolean = true;
  public loadedOneTime: boolean = false;
  public reloadTable: boolean = false;
  public teacher: any;
  public teacherid: any = 0;
  public teacherID: any;
  public duplicated: boolean = false;
  // DISABLED SELECT
  public isReadOnly1: boolean = true;
  public isReadOnly2: boolean = true;
  public isReadOnly3: boolean = true;
  public isReadOnly4: boolean = true;
  public isReadOnly5: boolean = true;
  public isReadOnly6: boolean = true;
  public isReadOnly7: boolean = true;
  public isReadOnly8: boolean = true;
  public isReadOnly9: boolean = true;
  public isReadOnly10: boolean = true;
  public isReadOnly11: boolean = true;
  public isReadOnly12: boolean = true;
  public isReadOnly13: boolean = true;
  public isReadOnly14: boolean = true;
  public isReadOnly15: boolean = true;
  public isReadOnly16: boolean = true;
  public isReadOnly17: boolean = true;
  public isReadOnly18: boolean = true;
  public isReadOnly19: boolean = true;
  public isReadOnly20: boolean = true;
  public isReadOnly21: boolean = true;
  public isReadOnly22: boolean = true;
  public isReadOnly23: boolean = true;
  public isReadOnly24: boolean = true;
  public isReadOnly25: boolean = true;
  public isReadOnly26: boolean = true;
  public isReadOnly27: boolean = true;
  public isReadOnly28: boolean = true;
  public isReadOnly29: boolean = true;
  public isReadOnly30: boolean = true;
  public isReadOnly31: boolean = true;
  public isReadOnly32: boolean = true;
  public isReadOnly33: boolean = true;
  public isReadOnly34: boolean = true;
  public isReadOnly35: boolean = true;
  public isReadOnly36: boolean = true;
  public isReadOnly37: boolean = true;
  public isReadOnly38: boolean = true;
  public isReadOnly39: boolean = true;
  public isReadOnly40: boolean = true;
  // DOM
  // MONDAY
  @ViewChild('Monday1Teacher') Monday1Teacher: any;
  @ViewChild('Monday1SubjectReadOnly') Monday1SubjectReadOnly: any;
  @ViewChild('Monday2Teacher') Monday2Teacher: any;
  @ViewChild('Monday2SubjectReadOnly') Monday2SubjectReadOnly: any;
  @ViewChild('Monday3Teacher') Monday3Teacher: any;
  @ViewChild('Monday3SubjectReadOnly') Monday3SubjectReadOnly: any;
  @ViewChild('Monday4Teacher') Monday4Teacher: any;
  @ViewChild('Monday4SubjectReadOnly') Monday4SubjectReadOnly: any;
  @ViewChild('Monday5Teacher') Monday5Teacher: any;
  @ViewChild('Monday5SubjectReadOnly') Monday5SubjectReadOnly: any;
  @ViewChild('Monday6Teacher') Monday6Teacher: any;
  @ViewChild('Monday6SubjectReadOnly') Monday6SubjectReadOnly: any;
  @ViewChild('Monday7Teacher') Monday7Teacher: any;
  @ViewChild('Monday7SubjectReadOnly') Monday7SubjectReadOnly: any;
  @ViewChild('Monday8Teacher') Monday8Teacher: any;
  @ViewChild('Monday8SubjectReadOnly') Monday8SubjectReadOnly: any;
  // TUESDAY
  @ViewChild('Tuesday1Teacher') Tuesday1Teacher: any;
  @ViewChild('Tuesday1SubjectReadOnly') Tuesday1SubjectReadOnly: any;
  @ViewChild('Tuesday2Teacher') Tuesday2Teacher: any;
  @ViewChild('Tuesday2SubjectReadOnly') Tuesday2SubjectReadOnly: any;
  @ViewChild('Tuesday3Teacher') Tuesday3Teacher: any;
  @ViewChild('Tuesday3SubjectReadOnly') Tuesday3SubjectReadOnly: any;
  @ViewChild('Tuesday4Teacher') Tuesday4Teacher: any;
  @ViewChild('Tuesday4SubjectReadOnly') Tuesday4SubjectReadOnly: any;
  @ViewChild('Tuesday5Teacher') Tuesday5Teacher: any;
  @ViewChild('Tuesday5SubjectReadOnly') Tuesday5SubjectReadOnly: any;
  @ViewChild('Tuesday6Teacher') Tuesday6Teacher: any;
  @ViewChild('Tuesday6SubjectReadOnly') Tuesday6SubjectReadOnly: any;
  @ViewChild('Tuesday7Teacher') Tuesday7Teacher: any;
  @ViewChild('Tuesday7SubjectReadOnly') Tuesday7SubjectReadOnly: any;
  @ViewChild('Tuesday8Teacher') Tuesday8Teacher: any;
  @ViewChild('Tuesday8SubjectReadOnly') Tuesday8SubjectReadOnly: any;
  // WEDNESDAY
  @ViewChild('Wednesday1Teacher') Wednesday1Teacher: any;
  @ViewChild('Wednesday1SubjectReadOnly') Wednesday1SubjectReadOnly: any;
  @ViewChild('Wednesday2Teacher') Wednesday2Teacher: any;
  @ViewChild('Wednesday2SubjectReadOnly') Wednesday2SubjectReadOnly: any;
  @ViewChild('Wednesday3Teacher') Wednesday3Teacher: any;
  @ViewChild('Wednesday3SubjectReadOnly') Wednesday3SubjectReadOnly: any;
  @ViewChild('Wednesday4Teacher') Wednesday4Teacher: any;
  @ViewChild('Wednesday4SubjectReadOnly') Wednesday4SubjectReadOnly: any;
  @ViewChild('Wednesday5Teacher') Wednesday5Teacher: any;
  @ViewChild('Wednesday5SubjectReadOnly') Wednesday5SubjectReadOnly: any;
  @ViewChild('Wednesday6Teacher') Wednesday6Teacher: any;
  @ViewChild('Wednesday6SubjectReadOnly') Wednesday6SubjectReadOnly: any;
  @ViewChild('Wednesday7Teacher') Wednesday7Teacher: any;
  @ViewChild('Wednesday7SubjectReadOnly') Wednesday7SubjectReadOnly: any;
  @ViewChild('Wednesday8Teacher') Wednesday8Teacher: any;
  @ViewChild('Wednesday8SubjectReadOnly') Wednesday8SubjectReadOnly: any;
  // THURSDAY
  @ViewChild('Thursday1Teacher') Thursday1Teacher: any;
  @ViewChild('Thursday1SubjectReadOnly') Thursday1SubjectReadOnly: any;
  @ViewChild('Thursday2Teacher') Thursday2Teacher: any;
  @ViewChild('Thursday2SubjectReadOnly') Thursday2SubjectReadOnly: any;
  @ViewChild('Thursday3Teacher') Thursday3Teacher: any;
  @ViewChild('Thursday3SubjectReadOnly') Thursday3SubjectReadOnly: any;
  @ViewChild('Thursday4Teacher') Thursday4Teacher: any;
  @ViewChild('Thursday4SubjectReadOnly') Thursday4SubjectReadOnly: any;
  @ViewChild('Thursday5Teacher') Thursday5Teacher: any;
  @ViewChild('Thursday5SubjectReadOnly') Thursday5SubjectReadOnly: any;
  @ViewChild('Thursday6Teacher') Thursday6Teacher: any;
  @ViewChild('Thursday6SubjectReadOnly') Thursday6SubjectReadOnly: any;
  @ViewChild('Thursday7Teacher') Thursday7Teacher: any;
  @ViewChild('Thursday7SubjectReadOnly') Thursday7SubjectReadOnly: any;
  @ViewChild('Thursday8Teacher') Thursday8Teacher: any;
  @ViewChild('Thursday8SubjectReadOnly') Thursday8SubjectReadOnly: any;
  // FRIDAY
  @ViewChild('Friday1Teacher') Friday1Teacher: any;
  @ViewChild('Friday1SubjectReadOnly') Friday1SubjectReadOnly: any;
  @ViewChild('Friday2Teacher') Friday2Teacher: any;
  @ViewChild('Friday2SubjectReadOnly') Friday2SubjectReadOnly: any;
  @ViewChild('Friday3Teacher') Friday3Teacher: any;
  @ViewChild('Friday3SubjectReadOnly') Friday3SubjectReadOnly: any;
  @ViewChild('Friday4Teacher') Friday4Teacher: any;
  @ViewChild('Friday4SubjectReadOnly') Friday4SubjectReadOnly: any;
  @ViewChild('Friday5Teacher') Friday5Teacher: any;
  @ViewChild('Friday5SubjectReadOnly') Friday5SubjectReadOnly: any;
  @ViewChild('Friday6Teacher') Friday6Teacher: any;
  @ViewChild('Friday6SubjectReadOnly') Friday6SubjectReadOnly: any;
  @ViewChild('Friday7Teacher') Friday7Teacher: any;
  @ViewChild('Friday7SubjectReadOnly') Friday7SubjectReadOnly: any;
  @ViewChild('Friday8Teacher') Friday8Teacher: any;
  @ViewChild('Friday8SubjectReadOnly') Friday8SubjectReadOnly: any;
  // ARRAYS
  // ROW 1
  public subjectMonday1: Array<String> = [];
  public subjectTuesday1: Array<String> = [];
  public subjectWednesday1: Array<String> = [];
  public subjectThursday1: Array<String> = [];
  public subjectFriday1: Array<String> = [];
  // ROW 2
  public subjectMonday2: Array<String> = [];
  public subjectTuesday2: Array<String> = [];
  public subjectWednesday2: Array<String> = [];
  public subjectThursday2: Array<String> = [];
  public subjectFriday2: Array<String> = [];
  // ROW 3
  public subjectMonday3: Array<String> = [];
  public subjectTuesday3: Array<String> = [];
  public subjectWednesday3: Array<String> = [];
  public subjectThursday3: Array<String> = [];
  public subjectFriday3: Array<String> = [];
  // ROW 4
  public subjectMonday4: Array<String> = [];
  public subjectTuesday4: Array<String> = [];
  public subjectWednesday4: Array<String> = [];
  public subjectThursday4: Array<String> = [];
  public subjectFriday4: Array<String> = [];
  // ROW 5
  public subjectMonday5: Array<String> = [];
  public subjectTuesday5: Array<String> = [];
  public subjectWednesday5: Array<String> = [];
  public subjectThursday5: Array<String> = [];
  public subjectFriday5: Array<String> = [];
  // ROW 6
  public subjectMonday6: Array<String> = [];
  public subjectTuesday6: Array<String> = [];
  public subjectWednesday6: Array<String> = [];
  public subjectThursday6: Array<String> = [];
  public subjectFriday6: Array<String> = [];
  // ROW 7
  public subjectMonday7: Array<String> = [];
  public subjectTuesday7: Array<String> = [];
  public subjectWednesday7: Array<String> = [];
  public subjectThursday7: Array<String> = [];
  public subjectFriday7: Array<String> = [];
  // ROW 8
  public subjectMonday8: Array<String> = [];
  public subjectTuesday8: Array<String> = [];
  public subjectWednesday8: Array<String> = [];
  public subjectThursday8: Array<String> = [];
  public subjectFriday8: Array<String> = [];
  // COUNSELORS
  public counselors:any;
  public CurrentCounselor:String = 'Orientador...';

  @ViewChild('title', { static: false }) title: any;

  constructor(private _route: ActivatedRoute, private _groupService: GroupService, private _teacherService: TeacherService, private changeDetectorRef: ChangeDetectorRef, private _counselorService:CounselorService) {
    this.group = new GroupModel('', '', '', [], [], [], [], [], '');
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params.id;
      this.loadedOneTime = false;
      this.getGroup(id);
    });
  }

  setCounselor()
  {
    this.counselors = [];
    this._counselorService.getCounselors().subscribe((response:any) => 
    {
      this.counselors=response.documents;
    });
    if(this.group.counselor != 'Orientador...') this._counselorService.getCounselorByID(this.group.counselor).subscribe(response => {if(response.document != null) this.CurrentCounselor=response.document.name+' '+response.document.lastnamep});
  }

  onChangeSelectCounselor(select:string)
  {
    if(select != '0')
    {
      this.group.counselor = select;
      this._groupService.updateGroup(this.group).subscribe(response =>
        {
          // REFRESH TABLE
          this.firstload = false;
          this.reloadTable = true;
          this.ngOnInit();
        });
    }
  }

  getGroup(id: any) {
    this.CurrentCounselor = 'Orientador...';
    this._groupService.getGroupByID(id).subscribe(
      response => {
        this.group = response.document;
        this.setCounselor();
        this.getTeachersByTurn();
      });
  }

  setTitle() {
    this.changeDetectorRef.detectChanges();
    this.title.nativeElement.setAttribute('data-typed-items', 'Grado ' + this.group.gen + ' - Grupo ' + this.group.group + ' / ' + this.group.turn + '.');
    this.startTyped();
  }

  getTeachersByTurn() {
    this._teacherService.getTeacherByTurn(this.group.turn).subscribe(response => {
      this.teacher = response.documents;
      this.loading = false;
      this.sortArrays();
      this.reloadTable = false;
      let select_teacher = document.getElementsByClassName('my-select');
      setTimeout(() => {
        Array.from(select_teacher).forEach((Element: any) => {
          Element.selectedIndex = 0;
        });
      }, 1);
      setTimeout(() => {
        this.setTeacherToSelect();
      }, 1);
      if (this.firstload) this.setTitle();
    });
  }

  sortArrays()
  {
    this.counselors = this.counselors.sort((a, b) => (a.name < b.name ? -1 : 1));
    this.teacher = this.teacher.sort((a, b) => (a.name < b.name ? -1 : 1));
    // MONDAY
    this.subjectMonday1 = this.subjectMonday1.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday2 = this.subjectMonday2.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday3 = this.subjectMonday3.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday4 = this.subjectMonday4.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday5 = this.subjectMonday5.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday6 = this.subjectMonday6.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday7 = this.subjectMonday7.sort((a, b) => (a < b ? -1 : 1));
    this.subjectMonday8 = this.subjectMonday8.sort((a, b) => (a < b ? -1 : 1));
    // TUESDAY
    this.subjectTuesday1 = this.subjectTuesday1.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday2 = this.subjectTuesday2.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday3 = this.subjectTuesday3.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday4 = this.subjectTuesday4.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday5 = this.subjectTuesday5.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday6 = this.subjectTuesday6.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday7 = this.subjectTuesday7.sort((a, b) => (a < b ? -1 : 1));
    this.subjectTuesday8 = this.subjectTuesday8.sort((a, b) => (a < b ? -1 : 1));
    // WEDNESDAY
    this.subjectWednesday1 = this.subjectWednesday1.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday2 = this.subjectWednesday2.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday3 = this.subjectWednesday3.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday4 = this.subjectWednesday4.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday5 = this.subjectWednesday5.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday6 = this.subjectWednesday6.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday7 = this.subjectWednesday7.sort((a, b) => (a < b ? -1 : 1));
    this.subjectWednesday8 = this.subjectWednesday8.sort((a, b) => (a < b ? -1 : 1));
    // THURSDAY
    this.subjectThursday1 = this.subjectThursday1.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday2 = this.subjectThursday2.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday3 = this.subjectThursday3.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday4 = this.subjectThursday4.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday5 = this.subjectThursday5.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday6 = this.subjectThursday6.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday7 = this.subjectThursday7.sort((a, b) => (a < b ? -1 : 1));
    this.subjectThursday8 = this.subjectThursday8.sort((a, b) => (a < b ? -1 : 1));
    // FRIDAY
    this.subjectFriday1 = this.subjectFriday1.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday2 = this.subjectFriday2.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday3 = this.subjectFriday3.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday4 = this.subjectFriday4.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday5 = this.subjectFriday5.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday6 = this.subjectFriday6.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday7 = this.subjectFriday7.sort((a, b) => (a < b ? -1 : 1));
    this.subjectFriday8 = this.subjectFriday8.sort((a, b) => (a < b ? -1 : 1));
  }

  setTeacherToSelect() {
    if (!this.reloadTable) {
      this.setMonday();
      this.setTuesday();
      this.setWednesday();
      this.setThursday();
      this.setFriday();
      this.setAllSelectToTrue();
    }
  }

  setMonday() {
    this.group.monday.forEach((Element: any) => {
      if (Element.hour == 'FIRST') { this.Monday1Teacher.nativeElement.value = Element.teacher_id; this.Monday1SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SECOND') { this.Monday2Teacher.nativeElement.value = Element.teacher_id; this.Monday2SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'THIRTH') { this.Monday3Teacher.nativeElement.value = Element.teacher_id; this.Monday3SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FOURTH') { this.Monday4Teacher.nativeElement.value = Element.teacher_id; this.Monday4SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FIFTH') { this.Monday5Teacher.nativeElement.value = Element.teacher_id; this.Monday5SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SIXTH') { this.Monday6Teacher.nativeElement.value = Element.teacher_id; this.Monday6SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SEVENTH') { this.Monday7Teacher.nativeElement.value = Element.teacher_id; this.Monday7SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'EIGHTH') { this.Monday8Teacher.nativeElement.value = Element.teacher_id; this.Monday8SubjectReadOnly.nativeElement.value = Element.subject }
    });
  }

  setTuesday() {
    this.group.tuesday.forEach((Element: any) => {
      if (Element.hour == 'FIRST') { this.Tuesday1Teacher.nativeElement.value = Element.teacher_id; this.Tuesday1SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SECOND') { this.Tuesday2Teacher.nativeElement.value = Element.teacher_id; this.Tuesday2SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'THIRTH') { this.Tuesday3Teacher.nativeElement.value = Element.teacher_id; this.Tuesday3SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FOURTH') { this.Tuesday4Teacher.nativeElement.value = Element.teacher_id; this.Tuesday4SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FIFTH') { this.Tuesday5Teacher.nativeElement.value = Element.teacher_id; this.Tuesday5SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SIXTH') { this.Tuesday6Teacher.nativeElement.value = Element.teacher_id; this.Tuesday6SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SEVENTH') { this.Tuesday7Teacher.nativeElement.value = Element.teacher_id; this.Tuesday7SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'EIGHTH') { this.Tuesday8Teacher.nativeElement.value = Element.teacher_id; this.Tuesday8SubjectReadOnly.nativeElement.value = Element.subject }
    });
  }

  setWednesday() {
    this.group.wednesday.forEach((Element: any) => {
      if (Element.hour == 'FIRST') { this.Wednesday1Teacher.nativeElement.value = Element.teacher_id; this.Wednesday1SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SECOND') { this.Wednesday2Teacher.nativeElement.value = Element.teacher_id; this.Wednesday2SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'THIRTH') { this.Wednesday3Teacher.nativeElement.value = Element.teacher_id; this.Wednesday3SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FOURTH') { this.Wednesday4Teacher.nativeElement.value = Element.teacher_id; this.Wednesday4SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FIFTH') { this.Wednesday5Teacher.nativeElement.value = Element.teacher_id; this.Wednesday5SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SIXTH') { this.Wednesday6Teacher.nativeElement.value = Element.teacher_id; this.Wednesday6SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SEVENTH') { this.Wednesday7Teacher.nativeElement.value = Element.teacher_id; this.Wednesday7SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'EIGHTH') { this.Wednesday8Teacher.nativeElement.value = Element.teacher_id; this.Wednesday8SubjectReadOnly.nativeElement.value = Element.subject }
    });
  }

  setThursday() {
    this.group.thursday.forEach((Element: any) => {
      if (Element.hour == 'FIRST') { this.Thursday1Teacher.nativeElement.value = Element.teacher_id; this.Thursday1SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SECOND') { this.Thursday2Teacher.nativeElement.value = Element.teacher_id; this.Thursday2SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'THIRTH') { this.Thursday3Teacher.nativeElement.value = Element.teacher_id; this.Thursday3SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FOURTH') { this.Thursday4Teacher.nativeElement.value = Element.teacher_id; this.Thursday4SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FIFTH') { this.Thursday5Teacher.nativeElement.value = Element.teacher_id; this.Thursday5SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SIXTH') { this.Thursday6Teacher.nativeElement.value = Element.teacher_id; this.Thursday6SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SEVENTH') { this.Thursday7Teacher.nativeElement.value = Element.teacher_id; this.Thursday7SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'EIGHTH') { this.Thursday8Teacher.nativeElement.value = Element.teacher_id; this.Thursday8SubjectReadOnly.nativeElement.value = Element.subject }
    });
  }

  setFriday() {
    this.group.friday.forEach((Element: any) => {
      if (Element.hour == 'FIRST') { this.Friday1Teacher.nativeElement.value = Element.teacher_id; this.Friday1SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SECOND') { this.Friday2Teacher.nativeElement.value = Element.teacher_id; this.Friday2SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'THIRTH') { this.Friday3Teacher.nativeElement.value = Element.teacher_id; this.Friday3SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FOURTH') { this.Friday4Teacher.nativeElement.value = Element.teacher_id; this.Friday4SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'FIFTH') { this.Friday5Teacher.nativeElement.value = Element.teacher_id; this.Friday5SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SIXTH') { this.Friday6Teacher.nativeElement.value = Element.teacher_id; this.Friday6SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'SEVENTH') { this.Friday7Teacher.nativeElement.value = Element.teacher_id; this.Friday7SubjectReadOnly.nativeElement.value = Element.subject }
      if (Element.hour == 'EIGHTH') { this.Friday8Teacher.nativeElement.value = Element.teacher_id; this.Friday8SubjectReadOnly.nativeElement.value = Element.subject }
    });
  }

  //---------------------------- SELECT GROUPS ---------------------------------------//
  onChangeSelect(TeacherID: any, Subject: any, Input: any, group: number) {
    if (TeacherID == '0') { this.disabledSelect(group); Input.value = "MATERIA"; }
    if (TeacherID == '1') {
      this.enableSelect(group);
      Subject.add(new Option('ORIENTACION'));
    }
    if (TeacherID == '2') {
      this.enableSelect(group);
      Subject.add(new Option('HORA LIBRE'));
    }
    if (TeacherID == '3') { this.disabledSelect(group); Input.value = "MATERIA"; }
    if (TeacherID != '0' && TeacherID != '1' && TeacherID != '2' && TeacherID != '3') {
      this._teacherService.getTeacherByID(TeacherID).subscribe(response => {
        setTimeout(() => {
          for (let i = 0; i < Subject.length; i++) {
            if (Subject.options[i].value == 'ORIENTACION' || Subject.options[i].value == 'HORA LIBRE') Subject.remove(i);
          }
        }, 50);
        this.enableSelect(group);
        // ROW 1
        if (group == 1) this.subjectMonday1 = response.document.subjects;
        if (group == 2) this.subjectTuesday1 = response.document.subjects;
        if (group == 3) this.subjectWednesday1 = response.document.subjects;
        if (group == 4) this.subjectThursday1 = response.document.subjects;
        if (group == 5) this.subjectFriday1 = response.document.subjects;
        // ROW 2
        if (group == 6) this.subjectMonday2 = response.document.subjects;
        if (group == 7) this.subjectTuesday2 = response.document.subjects;
        if (group == 8) this.subjectWednesday2 = response.document.subjects;
        if (group == 9) this.subjectThursday2 = response.document.subjects;
        if (group == 10) this.subjectFriday2 = response.document.subjects;
        // ROW 3
        if (group == 11) this.subjectMonday3 = response.document.subjects;
        if (group == 12) this.subjectTuesday3 = response.document.subjects;
        if (group == 13) this.subjectWednesday3 = response.document.subjects;
        if (group == 14) this.subjectThursday3 = response.document.subjects;
        if (group == 15) this.subjectFriday3 = response.document.subjects;
        // ROW 4
        if (group == 16) this.subjectMonday4 = response.document.subjects;
        if (group == 17) this.subjectTuesday4 = response.document.subjects;
        if (group == 18) this.subjectWednesday4 = response.document.subjects;
        if (group == 19) this.subjectThursday4 = response.document.subjects;
        if (group == 20) this.subjectFriday4 = response.document.subjects;
        // ROW 5
        if (group == 21) this.subjectMonday5 = response.document.subjects;
        if (group == 22) this.subjectTuesday5 = response.document.subjects;
        if (group == 23) this.subjectWednesday5 = response.document.subjects;
        if (group == 24) this.subjectThursday5 = response.document.subjects;
        if (group == 25) this.subjectFriday5 = response.document.subjects;
        // ROW 6
        if (group == 26) this.subjectMonday6 = response.document.subjects;
        if (group == 27) this.subjectTuesday6 = response.document.subjects;
        if (group == 28) this.subjectWednesday6 = response.document.subjects;
        if (group == 29) this.subjectThursday6 = response.document.subjects;
        if (group == 30) this.subjectFriday6 = response.document.subjects;
        // ROW 7
        if (group == 31) this.subjectMonday7 = response.document.subjects;
        if (group == 32) this.subjectTuesday7 = response.document.subjects;
        if (group == 33) this.subjectWednesday7 = response.document.subjects;
        if (group == 34) this.subjectThursday7 = response.document.subjects;
        if (group == 35) this.subjectFriday7 = response.document.subjects;
        // ROW 8
        if (group == 36) this.subjectMonday8 = response.document.subjects;
        if (group == 37) this.subjectTuesday8 = response.document.subjects;
        if (group == 38) this.subjectWednesday8 = response.document.subjects;
        if (group == 39) this.subjectThursday8 = response.document.subjects;
        if (group == 40) this.subjectFriday8 = response.document.subjects;
        this.sortArrays();
      });
    }
  }

  disabledSelect(group: any) {
    if (group == 1) this.isReadOnly1 = true;
    if (group == 2) this.isReadOnly2 = true;
    if (group == 3) this.isReadOnly3 = true;
    if (group == 4) this.isReadOnly4 = true;
    if (group == 5) this.isReadOnly5 = true;
    if (group == 6) this.isReadOnly6 = true;
    if (group == 7) this.isReadOnly7 = true;
    if (group == 8) this.isReadOnly8 = true;
    if (group == 9) this.isReadOnly9 = true;
    if (group == 10) this.isReadOnly10 = true;
    if (group == 11) this.isReadOnly11 = true;
    if (group == 12) this.isReadOnly12 = true;
    if (group == 13) this.isReadOnly13 = true;
    if (group == 14) this.isReadOnly14 = true;
    if (group == 15) this.isReadOnly15 = true;
    if (group == 16) this.isReadOnly16 = true;
    if (group == 17) this.isReadOnly17 = true;
    if (group == 18) this.isReadOnly18 = true;
    if (group == 19) this.isReadOnly19 = true;
    if (group == 20) this.isReadOnly20 = true;
    if (group == 21) this.isReadOnly21 = true;
    if (group == 22) this.isReadOnly22 = true;
    if (group == 23) this.isReadOnly23 = true;
    if (group == 24) this.isReadOnly24 = true;
    if (group == 25) this.isReadOnly25 = true;
    if (group == 26) this.isReadOnly26 = true;
    if (group == 27) this.isReadOnly27 = true;
    if (group == 28) this.isReadOnly28 = true;
    if (group == 29) this.isReadOnly29 = true;
    if (group == 30) this.isReadOnly30 = true;
    if (group == 31) this.isReadOnly31 = true;
    if (group == 32) this.isReadOnly32 = true;
    if (group == 33) this.isReadOnly33 = true;
    if (group == 34) this.isReadOnly34 = true;
    if (group == 35) this.isReadOnly35 = true;
    if (group == 36) this.isReadOnly36 = true;
    if (group == 37) this.isReadOnly37 = true;
    if (group == 38) this.isReadOnly38 = true;
    if (group == 39) this.isReadOnly39 = true;
    if (group == 40) this.isReadOnly40 = true;
  }

  enableSelect(group: any) {
    if (group == 1) this.isReadOnly1 = false;
    if (group == 2) this.isReadOnly2 = false;
    if (group == 3) this.isReadOnly3 = false;
    if (group == 4) this.isReadOnly4 = false;
    if (group == 5) this.isReadOnly5 = false;
    if (group == 6) this.isReadOnly6 = false;
    if (group == 7) this.isReadOnly7 = false;
    if (group == 8) this.isReadOnly8 = false;
    if (group == 9) this.isReadOnly9 = false;
    if (group == 10) this.isReadOnly10 = false;
    if (group == 11) this.isReadOnly11 = false;
    if (group == 12) this.isReadOnly12 = false;
    if (group == 13) this.isReadOnly13 = false;
    if (group == 14) this.isReadOnly14 = false;
    if (group == 15) this.isReadOnly15 = false;
    if (group == 16) this.isReadOnly16 = false;
    if (group == 17) this.isReadOnly17 = false;
    if (group == 18) this.isReadOnly18 = false;
    if (group == 19) this.isReadOnly19 = false;
    if (group == 20) this.isReadOnly20 = false;
    if (group == 21) this.isReadOnly21 = false;
    if (group == 22) this.isReadOnly22 = false;
    if (group == 23) this.isReadOnly23 = false;
    if (group == 24) this.isReadOnly24 = false;
    if (group == 25) this.isReadOnly25 = false;
    if (group == 26) this.isReadOnly26 = false;
    if (group == 27) this.isReadOnly27 = false;
    if (group == 28) this.isReadOnly28 = false;
    if (group == 29) this.isReadOnly29 = false;
    if (group == 30) this.isReadOnly30 = false;
    if (group == 31) this.isReadOnly31 = false;
    if (group == 32) this.isReadOnly32 = false;
    if (group == 33) this.isReadOnly33 = false;
    if (group == 34) this.isReadOnly34 = false;
    if (group == 35) this.isReadOnly35 = false;
    if (group == 36) this.isReadOnly36 = false;
    if (group == 37) this.isReadOnly37 = false;
    if (group == 38) this.isReadOnly38 = false;
    if (group == 39) this.isReadOnly39 = false;
    if (group == 40) this.isReadOnly40 = false;
  }

  setAllSelectToTrue() {
    this.isReadOnly1 = true;
    this.isReadOnly2 = true;
    this.isReadOnly3 = true;
    this.isReadOnly4 = true;
    this.isReadOnly5 = true;
    this.isReadOnly6 = true;
    this.isReadOnly7 = true;
    this.isReadOnly8 = true;
    this.isReadOnly9 = true;
    this.isReadOnly10 = true;
    this.isReadOnly11 = true;
    this.isReadOnly12 = true;
    this.isReadOnly13 = true;
    this.isReadOnly14 = true;
    this.isReadOnly15 = true;
    this.isReadOnly16 = true;
    this.isReadOnly17 = true;
    this.isReadOnly18 = true;
    this.isReadOnly19 = true;
    this.isReadOnly20 = true;
    this.isReadOnly21 = true;
    this.isReadOnly22 = true;
    this.isReadOnly23 = true;
    this.isReadOnly24 = true;
    this.isReadOnly25 = true;
    this.isReadOnly26 = true;
    this.isReadOnly27 = true;
    this.isReadOnly28 = true;
    this.isReadOnly29 = true;
    this.isReadOnly30 = true;
    this.isReadOnly31 = true;
    this.isReadOnly32 = true;
    this.isReadOnly33 = true;
    this.isReadOnly34 = true;
    this.isReadOnly35 = true;
    this.isReadOnly36 = true;
    this.isReadOnly37 = true;
    this.isReadOnly38 = true;
    this.isReadOnly39 = true;
    this.isReadOnly40 = true;
  }

  //---------------------------- SELECT SUBJECTS ---------------------------------------//
  onChangeSelectSubject(ID: any, day: any, hour: any, subject: any) {
    this.duplicated = false;
    if (hour == 1) hour = 'FIRST';
    if (hour == 2) hour = 'SECOND';
    if (hour == 3) hour = 'THIRTH';
    if (hour == 4) hour = 'FOURTH';
    if (hour == 5) hour = 'FIFTH';
    if (hour == 6) hour = 'SIXTH';
    if (hour == 7) hour = 'SEVENTH';
    if (hour == 8) hour = 'EIGHTH';
    let addGroupToTeacher =
    {
      day: day,
      hour: hour,
      id_group: this.group._id,
      subject: subject,
      turn: this.group.turn
    };
    this.checkDuplicated(ID, day, hour, subject, addGroupToTeacher);
  }

  checkDuplicated(ID: any, day: string, hour: string, subject: any, addGroupToTeacher: any) {
    let checkduplicated: boolean = false;
    if (subject == 'ORIENTACION' || subject == 'HORA LIBRE') this.isFill((day.toLowerCase()), hour, addGroupToTeacher, ID, subject);
    if (subject != 'ORIENTACION' && subject != 'HORA LIBRE') {
      this._teacherService.getTeacherByID(ID).subscribe(response => {
        response.document.groups.forEach((Element: any, Index: any) => {
          if (Element.day == day && Element.hour == hour) {
            if (response.document.turn == 'AMBOS') {
              if (this.group.turn != Element.turn) {
                if (Index == 1) checkduplicated = true;
                else checkduplicated = false;
              }
              else if (this.group.turn == Element.turn) checkduplicated = true;
            }
            else checkduplicated = true;
          }
          if (response.document.groups.length == Index + 1) {
            if (checkduplicated) {
              this.duplicated = true;
              // REFRESH TABLE
              this.firstload = false;
              this.reloadTable = true;
              this.ngOnInit();
              setTimeout(() => {
                this.duplicated = false;
              }, 5000);
            }
            if (!checkduplicated) this.isFill((day.toLowerCase()), hour, addGroupToTeacher, ID, subject);
          }
        });
        if (response.document.groups.length == 0) {
          if (subject == 'ORIENTACION' || subject == 'HORA LIBRE') this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, (day.toLowerCase()));
          if (subject != 'ORIENTACION' && subject != 'HORA LIBRE') this.isFill((day.toLowerCase()), hour, addGroupToTeacher, ID, subject);
        }
      });
    }
  }

  isFill(day: string, hour: string, addGroupToTeacher: any, ID: any, subject: any) {
    if (!this.loadedOneTime) {
      let isOnlyOne: boolean = true;
      //MONDAY
      if (day == 'monday') {
        this.group.monday.forEach((Element: any, Index: any) => {
          if (Element.hour == hour) {
            this.group.monday.splice(Index, 1);
            this._groupService.updateGroup(this.group).subscribe(response => {
              if (Element.teacher_id != '1' && Element.teacher_id != '2') {
                this._teacherService.getTeacherByID(Element.teacher_id).subscribe(response => {
                  response.document.groups.forEach((Element: any, Index: any) => {
                    if (Element.id_group == this.group._id && Element.hour == hour) {
                      response.document.groups.splice(Index, 1);
                      this._teacherService.updateTeacher(response.document).subscribe(response => {
                        isOnlyOne = false;
                      });
                    }
                  });
                });
              }
            });
          }
          if (this.group.monday.length == Index + 1 && isOnlyOne) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
        });
        if (this.group.monday.length == 0) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
      }
      //TUESDAY
      if (day == 'tuesday') {
        this.group.tuesday.forEach((Element: any, Index: any) => {
          if (Element.hour == hour) {
            this.group.tuesday.splice(Index, 1);
            this._groupService.updateGroup(this.group).subscribe(response => {
              if (Element.teacher_id != '1' && Element.teacher_id != '2') {
                this._teacherService.getTeacherByID(Element.teacher_id).subscribe(response => {
                  response.document.groups.forEach((Element: any, Index: any) => {
                    if (Element.id_group == this.group._id && Element.hour == hour) {
                      response.document.groups.splice(Index, 1);
                      this._teacherService.updateTeacher(response.document).subscribe(response => {
                        isOnlyOne = false;
                      });
                    }
                  });
                });
              }
            });
          }
          if (this.group.tuesday.length == Index + 1 && isOnlyOne) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
        });
        if (this.group.tuesday.length == 0) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
      }
      //WEDNESDAY
      if (day == 'wednesday') {
        this.group.wednesday.forEach((Element: any, Index: any) => {
          if (Element.hour == hour) {
            this.group.wednesday.splice(Index, 1);
            this._groupService.updateGroup(this.group).subscribe(response => {
              if (Element.teacher_id != '1' && Element.teacher_id != '2') {
                this._teacherService.getTeacherByID(Element.teacher_id).subscribe(response => {
                  response.document.groups.forEach((Element: any, Index: any) => {
                    if (Element.id_group == this.group._id && Element.hour == hour) {
                      response.document.groups.splice(Index, 1);
                      this._teacherService.updateTeacher(response.document).subscribe(response => {
                        isOnlyOne = false;
                      });
                    }
                  });
                });
              }
            });
          }
          if (this.group.wednesday.length == Index + 1 && isOnlyOne) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
        });
        if (this.group.wednesday.length == 0) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
      }
      //THURSDAY
      if (day == 'thursday') {
        this.group.thursday.forEach((Element: any, Index: any) => {
          if (Element.hour == hour) {
            this.group.thursday.splice(Index, 1);
            this._groupService.updateGroup(this.group).subscribe(response => {
              if (Element.teacher_id != '1' && Element.teacher_id != '2') {
                this._teacherService.getTeacherByID(Element.teacher_id).subscribe(response => {
                  response.document.groups.forEach((Element: any, Index: any) => {
                    if (Element.id_group == this.group._id && Element.hour == hour) {
                      response.document.groups.splice(Index, 1);
                      this._teacherService.updateTeacher(response.document).subscribe(response => {
                        isOnlyOne = false;
                      });
                    }
                  });
                });
              }
            });
          }
          if (this.group.thursday.length == Index + 1 && isOnlyOne) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
        });
        if (this.group.thursday.length == 0) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
      }
      //FRIDAY
      if (day == 'friday') {
        this.group.friday.forEach((Element: any, Index: any) => {
          if (Element.hour == hour) {
            this.group.friday.splice(Index, 1);
            this._groupService.updateGroup(this.group).subscribe(response => {
              if (Element.teacher_id != '1' && Element.teacher_id != '2') {
                this._teacherService.getTeacherByID(Element.teacher_id).subscribe(response => {
                  response.document.groups.forEach((Element: any, Index: any) => {
                    if (Element.id_group == this.group._id && Element.hour == hour) {
                      response.document.groups.splice(Index, 1);
                      this._teacherService.updateTeacher(response.document).subscribe(response => {
                        isOnlyOne = false;
                      });
                    }
                  });
                });
              }
            });
          }
          if (this.group.friday.length == Index + 1 && isOnlyOne) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
        });
        if (this.group.friday.length == 0) this.setTeacherGroup(ID, addGroupToTeacher, hour, subject, day);
      }
    }
  }

  setTeacherGroup(ID: any, addGroupToTeacher: any, hour: any, subject: any, day: any) {
    if (subject == 'ORIENTACION' || subject == 'HORA LIBRE') {
      let setValue;
      if (subject == 'ORIENTACION') setValue = '1';
      if (subject == 'HORA LIBRE') setValue = '2';
      let addTeacherToGroup =
      {
        hour: hour,
        teacher_id: setValue,
        subject: subject
      };
      this._groupService.addTeacher(this.group._id, addTeacherToGroup, day.toLowerCase()).subscribe(response => {
        this.loadedOneTime = true;
        // REFRESH TABLE
        this.firstload = false;
        this.reloadTable = true;
        this.ngOnInit();
      });
    }
    else {
      this._teacherService.addGroup(ID, addGroupToTeacher).subscribe(response => {
        let addTeacherToGroup =
        {
          hour: hour,
          teacher_id: response.project._id,
          subject: subject
        };
        this._groupService.addTeacher(this.group._id, addTeacherToGroup, day.toLowerCase()).subscribe(response => {
          // REFRESH TABLE
          this.firstload = false;
          this.reloadTable = true;
          this.ngOnInit();
        });
      });
    }
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedGroup').length) {
        var typed_strings = $(".typedGroup").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedGroup', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 20
        });
      }
    }, 1);
  }

}
