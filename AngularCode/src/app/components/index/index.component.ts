import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { CounselorService } from '../../services/counselor.service';
import Chart from 'chart.js';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [TeacherService, CounselorService]
})
export class IndexComponent implements OnInit {

  Data:any = {
    TeacherMorning: 0,
    TeacherEvening: 0,
    TeacherBoth: 0,
    CounselorMorning: 0,
    CounselorEvening: 0,
    CounselorBoth: 0
  };
  // LOADING
  loading: boolean = true;

  constructor(private _teacherService:TeacherService, private _counselorService:CounselorService) { }

  ngOnInit(): void {
    this.startTyped();
    this.getLenght();
  }

  getLenght()
  {
    this._teacherService.getTeachers().subscribe((response:any) =>{
      response.documents.forEach((Teacher) =>
      {
        if(Teacher.turn == 'MATUTINO') this.Data.TeacherMorning++;
        else if(Teacher.turn == 'VESPERTINO') this.Data.TeacherEvening++;
        else if(Teacher.turn == 'AMBOS') {this.Data.TeacherMorning++;this.Data.TeacherEvening++;this.Data.TeacherBoth++;}
      });
      this._counselorService.getCounselors().subscribe((response:any) => {
        response.documents.forEach((Counselor) =>
        {
          if(Counselor.turn == 'MATUTINO') this.Data.CounselorMorning++;
          else if(Counselor.turn == 'VESPERTINO') this.Data.CounselorEvening++;
          else if(Counselor.turn == 'AMBOS') {this.Data.CounselorMorning++;this.Data.CounselorEvening++;this.Data.CounselorBoth++;}
        });
        this.loading = false;
        setTimeout(() => {this.startChart();}, 1);
      });
    });
  }

  startChart()
  {
    var ctx = document.getElementById('myChart');
    var ctx2 = document.getElementById('myChart2');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Matutino', 'Vespertino', 'Ambos Turnos'],
            datasets: [
              {
                label: 'Profesores',
                data: [this.Data.TeacherMorning, this.Data.TeacherEvening, this.Data.TeacherBoth],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(75, 192, 192, 0.2)'
                ],
                borderWidth: 2
            },
            {
              label: 'Orientadores',
              data: [this.Data.CounselorMorning, this.Data.CounselorEvening, this.Data.CounselorBoth],
              backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderWidth: 2
          }
          ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  }
  
    //---------------------------- TYPED ---------------------------------------//
    startTyped() {
      setTimeout(() => {
        if ($('.typedIndex').length) {
          var typed_strings = $(".typedIndex").data('typed-items');
          typed_strings = typed_strings.split(',')
          new Typed('.typedIndex', {
            strings: typed_strings,
            loop: false,
            typeSpeed: 50
          });
        }
      }, 1);
    }
}
