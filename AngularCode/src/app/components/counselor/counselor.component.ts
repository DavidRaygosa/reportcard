import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { CounselorService } from '../../services/counselor.service';
import { CounselorModel } from '../../models/counselor.model';
import { GroupService } from '../../services/group.service';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-counselor',
  templateUrl: './counselor.component.html',
  styleUrls: ['./counselor.component.scss'],
  providers: [GeneralService, GroupService]
})
export class CounselorComponent implements OnInit {

  public loading: boolean = true;
  public error: boolean = false;
  public error_message: String = '';
  public successRegister: boolean = false;
  public successDelete: boolean = false;
  public CounselorToCreate: CounselorModel;
  //----------- PAGINATION -------
  public NumberofPagination: Array<number> = [];
  public paginationList: any;
  public selectedPage: number = 0;
  public selectedListPage: number = 0;
  public viewListPage: any;
  public rangeCounselors: any;
  //----------- COUNSELORS --------
  public counselor: any;
  public Counselors: any;
  public IDCounselor: any;
  @ViewChild('btn_closeNewCounselor') btn_closeNewCounselor: any;
  //----------- DELETE MODAL ------
  @ViewChild('closeDeleteModal') closeDeleteModal: any;
  @ViewChild('deleteModalBtn') deleteModalBtn: any;
  //----------- EDIT MODAL ------
  public editLoaded: boolean = false;
  public oneCounselor: any;
  public error_edit: boolean = false;
  public error_edit_message: String = '';
  public successEdit: boolean = false;
  @ViewChild('editNameDOM') editNameDOM: any;
  @ViewChild('editLastnamePDOM') editLastnamePDOM: any;
  @ViewChild('editLastnameMDOM') editLastnameMDOM: any;
  @ViewChild('editGradeDOM') editGradeDOM: any;
  @ViewChild('btn_closeEditCounselor') btn_closeEditCounselor: any;
  @ViewChild('editModalBtn') editModalBtn: any;
  //----------- SEARCH MODAL ------
  public searchResults: any;
  public search: boolean = false;
  @ViewChild('searchModal') searchModal: any;

  constructor(private _counselorService: CounselorService, private _generalService: GeneralService, private _groupService:GroupService) {
    this.CounselorToCreate = new CounselorModel('', '', '', '', '');
  }
  CounselortocreateContructor() {
    this.CounselorToCreate = new CounselorModel('', '', '', '', '')
  }
  ngOnInit(): void {
    this.loading = true;
    this.CounselorsLenght();
  }
  newCounselor() {
    this.getCounselors();
    let select_new_counselor = document.getElementById('selectNewGrade') as HTMLSelectElement;
    let select_new_turn_counselor = document.getElementById('selectNewTurn') as HTMLSelectElement;
    select_new_counselor.value = '0';
    select_new_turn_counselor.value = '0';
  }
  onNewSubmit(event: any, form: any) {
    let select_new_counselor = document.getElementById('selectNewGrade') as HTMLSelectElement;
    let select_new_turn_counselor = document.getElementById('selectNewTurn') as HTMLSelectElement;
    if (this.isEmptyField_new(select_new_counselor, select_new_turn_counselor)) {
      this.registerNewCounselor(form, select_new_counselor, select_new_turn_counselor);
    }
  }
  registerNewCounselor(form: any, select: any, select_turn: any) {
    this.CounselorToCreate.name = form.value.newName.toUpperCase();
    this.CounselorToCreate.lastnamep = form.value.newLastnameP.toUpperCase();
    this.CounselorToCreate.lastnamem = form.value.newLastnameM.toUpperCase();
    if (select.value == '1') this.CounselorToCreate.grade = 'ORIENTADOR';
    if (select_turn.value == '1') this.CounselorToCreate.turn = 'MATUTINO';
    if (select_turn.value == '2') this.CounselorToCreate.turn = 'VESPERTINO';
    if (select_turn.value == '3') this.CounselorToCreate.turn = 'AMBOS';
    this.cleanform_new(form, select, select_turn);
    this._counselorService.createCounselor(this.CounselorToCreate).subscribe(
      response => {
        this._generalService.getGeneral().subscribe(
          response => {
            response.documents[0].counselorlenght++;
            this._generalService.updateGeneral(response.documents[0]).subscribe(response => {
              this.CounselortocreateContructor();
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
    if (select.value == '0') { this.error = true; this.error_message = 'Por favor agrega un puesto al orientador'; return false; }
    if (select_turn.value == '0') { this.error = true; this.error_message = 'Por favor agrega un turno al orientador'; return false; }
    return true;
  }
  cleanform_new(form: any, select: any, select_turn: any) {
    form.reset();
    select.value = '0';
    select_turn.value = '0';
    this.btn_closeNewCounselor.nativeElement.click();
  }

  /************ PAGINATION  *******************/

  //---------------------------- PAGINATION ---------------------------------------//
  CounselorsLenght() {
    this._generalService.getGeneral().subscribe(
      (response: any) => {
        // SET LOADING TO FALSE (IT WILL SHOW POST CONTENT)
        this.loading = false;
        this.startTyped();
        // GET PAGINATION LENGHT
        this.NumberofPagination = [];
        this.paginationList = [];
        let count = 0;
        for (let i = 0; i < Math.ceil(response.documents[0].counselorlenght / 5); i++) {
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
    if (numberofPage == 1) this.rangeCounselors = { skip: 0 }
    else this.rangeCounselors = { skip: (numberofPage - 1) * 5 }
    this.getCounselors();
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
        if(backButton != null) backButton.classList.add("disabled");
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

  //---------------------------- COUNSELORS ---------------------------------------//
  getCounselors() {
    this._counselorService.getCounselorsRange(this.rangeCounselors.skip).subscribe((response: any) => this.Counselors = response.documents);
  }
  getCounselorID(id: any) {
    if (this.search)
    {
      this.searchModal.nativeElement.click();
      this.search = false;
      setTimeout(() => {
        this.deleteModalBtn.nativeElement.click();
      }, 500);
    }
    this.IDCounselor = id;
  }

  //---------------------------- DELETE MODAL ---------------------------------------//
  delete() {
    this._counselorService.getCounselorByID(this.IDCounselor).subscribe(response =>
      {
        // DELETE COUSELOR OF GROUPS
        this._groupService.getGroups().subscribe((response:any) =>
          {
            response.documents.forEach((Group) =>
            {
              if(Group.counselor == this.IDCounselor)
              {
                Group.counselor = '';
                this._groupService.updateGroup(Group).subscribe();
              }
            });
          });
        // SERVICE DELETE USER BY ID
        this._counselorService.deleteCounselor(this.IDCounselor).subscribe(
          reseponse => {
            // SERVICE CALL GENERAL SETTINGS
            this._generalService.getGeneral().subscribe(
              (response: any) => {
                response.documents[0].counselorlenght--;
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
      this.counselor.name = this.editNameDOM.nativeElement.value.toUpperCase();;
      this.counselor.lastnamep = this.editLastnamePDOM.nativeElement.value.toUpperCase();;
      this.counselor.lastnamem = this.editLastnameMDOM.nativeElement.value.toUpperCase();;
      if (selectEditTurn.value == '1') this.counselor.turn = 'MATUTINO';
      if (selectEditTurn.value == '2') this.counselor.turn = 'VESPERTINO';
      if (selectEditTurn.value == '3') this.counselor.turn = 'AMBOS';
      this._counselorService.updateCounselor(this.counselor).subscribe(response => {
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
    this.btn_closeEditCounselor.nativeElement.click();
  }
  isEmptyInputEdit() {
    this.error_edit = false;
    this.error_edit_message = '';
    if (this.editNameDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un nombre'; return false; }
    if (this.editLastnamePDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un apellido paterno'; return false; }
    if (this.editLastnameMDOM.nativeElement.value == '') { this.error_edit = true; this.error_edit_message = 'Por favor Ingresa un apellido materno'; return false; }
    return true;
  }
  setCounselorEdit(counselor_ID: any) {
    if (this.search)
    {
      this.searchModal.nativeElement.click();
      this.search = false;
      setTimeout(() => {
        this.editModalBtn.nativeElement.click();
      }, 500);
    }
    this._counselorService.getCounselorByID(counselor_ID).subscribe(response => {
      this.counselor = response.document;
      this.editLoaded = true;
      this.editNameDOM.nativeElement.value = this.counselor.name;
      this.editLastnamePDOM.nativeElement.value = this.counselor.lastnamep;
      this.editLastnameMDOM.nativeElement.value = this.counselor.lastnamem;
      this.editGradeDOM.nativeElement.value = this.counselor.grade;
      setTimeout(() => {
        let select_edit_turn = document.getElementById('selectEditTurn') as HTMLSelectElement;
        select_edit_turn.selectedIndex = 0;
      }, 1);
    });
  }
  editOnSubmit(event: any) {
    if (event.target.Subject.value.length > 0) {
      this.counselor.subjects.push(event.target.Subject.value);
      event.target.Subject.value = '';
    }
  }
  deleteEditSubject(index: any) {
    this.counselor.subjects.splice(index, 1);
  }

  //---------------------------- SEARCH MODAL ---------------------------------------//
  onSearchSubmit(event: any, form: any) {
    this.searchResults = [];
    this.search = false;
    this._counselorService.getCounselorByLastname((event.target.searchLastname.value).toUpperCase()).subscribe(response => {
      if (response.message == 'No Hay Proyectos Para Mostrar') this.search = false;
      else { this.searchResults = response.documents; this.search = true; }
    });
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedCounselor').length) {
        var typed_strings = $(".typedCounselor").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedCounselor', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 50
        });
      }
    }, 1);
  }
}