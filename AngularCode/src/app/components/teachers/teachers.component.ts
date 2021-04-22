import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { TeacherModel } from '../../models/teacher.model';
import { GeneralService } from '../../services/general.service';
import { GroupService } from '../../services/group.service';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
  providers: [TeacherService, GeneralService, GroupService]
})
export class TeachersComponent implements OnInit {

  public loading: boolean = true;
  public newSubject: Array<String>;
  public error: boolean = false;
  public error_message: String = '';
  public successRegister: boolean = false;
  public successDelete: boolean = false;
  public TeacherToCreate: TeacherModel;
  //----------- PAGINATION -------
  public NumberofPagination: Array<number> = [];
  public paginationList: any;
  public selectedPage: number = 0;
  public selectedListPage: number = 0;
  public viewListPage: any;
  public rangeTeachers: any;
  //----------- TEACHERS --------
  public teacher: any;
  public Teachers: any;
  public IDTeacher: any;
  @ViewChild('btn_closeNewTeacher') btn_closeNewTeacher: any;
  //----------- DELETE MODAL ------
  @ViewChild('closeDeleteModal') closeDeleteModal: any;
  @ViewChild('deleteModalBtn') deleteModalBtn: any;
  //----------- EDIT MODAL ------
  public editLoaded: boolean = false;
  public error_edit: boolean = false;
  public error_edit_message: String = '';
  public successEdit: boolean = false;
  @ViewChild('editNameDOM') editNameDOM: any;
  @ViewChild('editLastnamePDOM') editLastnamePDOM: any;
  @ViewChild('editLastnameMDOM') editLastnameMDOM: any;
  @ViewChild('editGradeDOM') editGradeDOM: any;
  @ViewChild('btn_closeEditTeacher') btn_closeEditTeacher: any;
  @ViewChild('editModalBtn') editModalBtn: any;
  //----------- SEARCH MODAL ------
  public searchResults: any;
  public search: boolean = false;
  @ViewChild('searchModal') searchModal: any;

  constructor(private _teacherService: TeacherService, private _generalService: GeneralService, private _groupService:GroupService) {
    this.newSubject = [];
    this.TeacherToCreate = new TeacherModel('', '', '', '', '', [], []);
  }
  teachertocreateContructor() {
    this.TeacherToCreate = new TeacherModel('', '', '', '', '', [], [])
  }
  ngOnInit(): void {
    this.loading = true;
    this.TeachersLenght();
  }
  newTeacher() {
    let select_new_teacher = document.getElementById('selectNewGrade') as HTMLSelectElement;
    let select_new_turn_teacher = document.getElementById('selectNewTurn') as HTMLSelectElement;
    select_new_teacher.value = '0';
    select_new_turn_teacher.value = '0';
  }
  onSubmit(event: any) {
    if (event.target.Subject.value.length > 0) {
      this.newSubject.push(event.target.Subject.value);
      event.target.Subject.value = '';
    }
  }
  deleteNewSubject(index: any) {
    this.newSubject.splice(index, 1);
  }
  onNewSubmit(event: any, form: any) {
    let select_new_teacher = document.getElementById('selectNewGrade') as HTMLSelectElement;
    let select_new_turn_teacher = document.getElementById('selectNewTurn') as HTMLSelectElement;
    if (this.isEmptyField_new(select_new_teacher, select_new_turn_teacher)) {
      this.registerNewTeacher(form, select_new_teacher, select_new_turn_teacher);
    }
  }
  registerNewTeacher(form: any, select: any, select_turn: any) {
    this.TeacherToCreate.name = form.value.newName.toUpperCase();
    this.TeacherToCreate.lastnamep = form.value.newLastnameP.toUpperCase();
    this.TeacherToCreate.lastnamem = form.value.newLastnameM.toUpperCase();
    if (select.value == '1') this.TeacherToCreate.grade = 'PROFESOR';
    if (select_turn.value == '1') this.TeacherToCreate.turn = 'MATUTINO';
    if (select_turn.value == '2') this.TeacherToCreate.turn = 'VESPERTINO';
    if (select_turn.value == '3') this.TeacherToCreate.turn = 'AMBOS';
    // CONVERT ARRAY TO UPPERCASE
    this.newSubject = this.newSubject.map(function (e) {
      return e.toUpperCase()
    });
    this.TeacherToCreate.subjects = this.newSubject;
    this.TeacherToCreate.groups = [];
    this.cleanform_new(form, select, select_turn);
    this._teacherService.createTeacher(this.TeacherToCreate).subscribe(
      response => {
        this._generalService.getGeneral().subscribe(
          response => {
            response.documents[0].teacherslenght++;
            this._generalService.updateGeneral(response.documents[0]).subscribe(response => {
              this.teachertocreateContructor();
              this.successRegister = true;
              this.ngOnInit();
              setTimeout(() => {
                this.successRegister = false;
              }, 5000);
            });
          });
      });
  }
  isEmptyField_new(select: any, select_turn: any) {
    this.error = false;
    this.error_message = '';
    if (select.value == '0') { this.error = true; this.error_message = 'Por favor agrega un puesto al profesor'; return false; }
    if (select_turn.value == '0') { this.error = true; this.error_message = 'Por favor agrega un turno al profesor'; return false; }
    if (this.newSubject.length == 0) { this.error = true; this.error_message = 'Por favor ingrese al menos 1 materia'; return false; }
    return true;
  }
  cleanform_new(form: any, select: any, select_turn: any) {
    form.reset();
    select.value = '0';
    select_turn.value = '0';
    this.newSubject = [];
    this.btn_closeNewTeacher.nativeElement.click();
  }

  /************ PAGINATION  *******************/

  //---------------------------- PAGINATION ---------------------------------------//
  TeachersLenght() {
    this._generalService.getGeneral().subscribe(
      (response: any) => {
        // SET LOADING TO FALSE (IT WILL SHOW POST CONTENT)
        this.loading = false;
        this.startTyped();
        // GET PAGINATION LENGHT
        this.NumberofPagination = [];
        this.paginationList = [];
        let count = 0;
        for (let i = 0; i < Math.ceil(response.documents[0].teacherslenght / 5); i++) {
          count++;
          this.NumberofPagination.push(i + 1);
          if (count == 5) {
            count = 0;
            this.paginationList.push('list');
          }
        }
        // GET, SET AND ACTIVE PAGINATION NUMBER
        this.changePage(1);
        this.setActivePagination(1);
        // SET LIST PAGINATION (ONLY 5 PAGE FOR LIST)
        this.setListPage();
      });
  }
  changePage(numberofPage: number) {
    if (numberofPage == 1) this.rangeTeachers = { skip: 0 }
    else this.rangeTeachers = { skip: (numberofPage - 1) * 5 }
    this.getTeachers();
  }
  setActivePagination(index: number) {
    this.selectedListPage = Math.ceil(index / 5) - 1;
    this.selectedPage = index;
    setTimeout(() => {
      let backButton = document.getElementById("backListButton") as HTMLSelectElement;
      let nextButton = document.getElementById("nextListButton") as HTMLSelectElement;
      this.checkIfDisabledBackListPage(backButton);
      this.checkIfDisabledNextListPage(nextButton);
    }, 1);
  }
  setListPage() {
    this.viewListPage =
    {
      start: (this.selectedListPage * 5),
      end: (this.selectedListPage + 1) * 5
    }
  }
  checkIfDisabledBackListPage(backButton: any) {
    if (!this.loading) {
      if (this.selectedListPage == 0) {
        backButton.classList.add("disabled");
      }
    }
  }
  checkIfDisabledNextListPage(nextButton: any) {
    if (!this.loading) {
      if (this.selectedListPage == Math.ceil(this.paginationList.length)) nextButton.classList.add("disabled");
    }
  }
  nextListPage(click = false) {
    let backButton = document.getElementById("backListButton") as HTMLSelectElement;
    let nextButton = document.getElementById("nextListButton") as HTMLSelectElement;
    backButton.classList.remove("disabled");
    if (click) this.selectedListPage++;
    this.checkIfDisabledNextListPage(nextButton);
    this.viewListPage =
    {
      start: (this.selectedListPage * 5),
      end: (this.selectedListPage + 1) * 5
    }
  }
  backListPage(click = false) {
    let backButton = document.getElementById("backListButton") as HTMLSelectElement;
    let nextButton = document.getElementById("nextListButton") as HTMLSelectElement;
    nextButton.classList.remove("disabled");
    if (click) this.selectedListPage--;
    this.checkIfDisabledBackListPage(backButton);
    this.viewListPage =
    {
      start: (this.selectedListPage * 5),
      end: (this.selectedListPage + 1) * 5
    }
  }

  //---------------------------- TEACHERS ---------------------------------------//
  getTeachers() {
    this._teacherService.getTeachersRange(this.rangeTeachers.skip).subscribe((response: any) => this.Teachers = response.documents);
  }
  getTeacherID(id: any) {
    if (this.search)
    {
      this.searchModal.nativeElement.click();
      this.search = false;
      setTimeout(() => {
        this.deleteModalBtn.nativeElement.click();
      }, 500);
    }
    this.IDTeacher = id;
  }

  //---------------------------- DELETE MODAL ---------------------------------------//
  delete() {
    // SERVICE DELETE USER BY ID
    this._teacherService.getTeacherByID(this.IDTeacher).subscribe((response:any) =>
      {
        response.document.groups.forEach((Group) =>
        {
          this._groupService.getGroupByID(Group.id_group).subscribe(response =>
            {
              response.document.monday.forEach((Monday, Index) =>
              {
                if(Monday.teacher_id == this.IDTeacher) response.document.monday.splice(Index, 1);
              });
              response.document.tuesday.forEach((Tuesday, Index) =>
              {
                if(Tuesday.teacher_id == this.IDTeacher) response.document.tuesday.splice(Index, 1);
              });
              response.document.wednesday.forEach((Wednesday, Index) =>
              {
                if(Wednesday.teacher_id == this.IDTeacher) response.document.wednesday.splice(Index, 1);
              });
              response.document.thursday.forEach((Thursday, Index) =>
              {
                if(Thursday.teacher_id == this.IDTeacher) response.document.thursday.splice(Index, 1);
              });
              response.document.friday.forEach((Friday, Index) =>
              {
                if(Friday.teacher_id == this.IDTeacher) response.document.friday.splice(Index, 1);
              });
              // UPDATE GROUPS
              this._groupService.updateGroup(response.document).subscribe();
            });
        });
        // DETELE TEACHER
        this._teacherService.deleteTeacher(this.IDTeacher).subscribe(
          reseponse => {
            // SERVICE CALL GENERAL SETTINGS
            this._generalService.getGeneral().subscribe(
              (response: any) => {
                response.documents[0].teacherslenght--;
                // SERVICE UPDATE GENERAL SETTINGS
                this._generalService.updateGeneral(response.documents[0]).subscribe(
                  response => {
                    this.closeDeleteModal.nativeElement.click();
                    this.successDelete = true;
                    this.ngOnInit();
                    setTimeout(() => {
                      this.successDelete = false;
                    }, 5000);
                  });
              });
          });
      });
  }

  //---------------------------- EDIT MODAL ---------------------------------------//
  onEditSubmit(event: any, form: any) {
    if (this.isEmptyInputEdit()) {
      let selectEditTurn = document.getElementById('selectEditTurn') as HTMLSelectElement;
      this.teacher.name = this.editNameDOM.nativeElement.value.toUpperCase();;
      this.teacher.lastnamep = this.editLastnamePDOM.nativeElement.value.toUpperCase();;
      this.teacher.lastnamem = this.editLastnameMDOM.nativeElement.value.toUpperCase();;
      if (selectEditTurn.value == '1') this.teacher.turn = 'MATUTINO';
      if (selectEditTurn.value == '2') this.teacher.turn = 'VESPERTINO';
      if (selectEditTurn.value == '3') this.teacher.turn = 'AMBOS';
      this.teacher.subjects = this.teacher.subjects;
      this.teacher.subjects = this.teacher.subjects.map(function (e: any) {
        return e.toUpperCase()
      });
      this._teacherService.updateTeacher(this.teacher).subscribe(response => {
        this.successEdit = true;
        this.cleanform_edit(form);
        this.ngOnInit();
        setTimeout(() => {
          this.successEdit = false;
        }, 5000);
      });
    }
  }
  cleanform_edit(form: any) {
    form.reset();
    this.btn_closeEditTeacher.nativeElement.click();
  }
  isEmptyInputEdit() {
    this.error_edit = false;
    this.error_edit_message = '';
    if (this.editNameDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un nombre'; return false; }
    if (this.editLastnamePDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un apellido paterno'; return false; }
    if (this.editLastnameMDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un apellido materno'; return false; }
    if (this.teacher.subjects.length == 0) { this.error_edit = true; this.error_edit_message = 'Por favor ingrese al menos 1 materia'; return false; }
    return true;
  }
  setTeacherEdit(teacher_ID: any) {
    if (this.search)
    {
      this.searchModal.nativeElement.click();
      this.search = false;
      setTimeout(() => {
        this.editModalBtn.nativeElement.click();
      }, 500);
    }
    this._teacherService.getTeacherByID(teacher_ID).subscribe(response => {
      this.teacher = response.document;
      this.editLoaded = true;
      this.editNameDOM.nativeElement.value = this.teacher.name;
      this.editLastnamePDOM.nativeElement.value = this.teacher.lastnamep;
      this.editLastnameMDOM.nativeElement.value = this.teacher.lastnamem;
      this.editGradeDOM.nativeElement.value = this.teacher.grade;
      setTimeout(() => {
        let select_edit_turn = document.getElementById('selectEditTurn') as HTMLSelectElement;
        select_edit_turn.selectedIndex = 0;
      }, 1);
    });
  }
  editOnSubmit(event: any) {
    if (event.target.Subject.value.length > 0) {
      this.teacher.subjects.push(event.target.Subject.value);
      event.target.Subject.value = '';
    }
  }
  deleteEditSubject(index: any) {
    this.teacher.subjects.splice(index, 1);
  }

  //---------------------------- SEARCH MODAL ---------------------------------------//
  onSearchSubmit(event: any, form: any) {
    this.searchResults = [];
    this.search = false;
    this._teacherService.getTeacherByLastname((event.target.searchLastname.value).toUpperCase()).subscribe(response => {
      if (response.message == 'No Hay Proyectos Para Mostrar') this.search = false;
      else { this.searchResults = response.documents; this.search = true; }
    });
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedTeacher').length) {
        var typed_strings = $(".typedTeacher").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedTeacher', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 50
        });
      }
    }, 1);
  }
}