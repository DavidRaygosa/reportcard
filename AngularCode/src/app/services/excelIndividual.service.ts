import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Global } from './global';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Injectable({
    providedIn: 'root'
})
export class ExcelIndividualService {
    public url: string;
    public logos:any;
    public title:string = '';
    public PageNumber: number = 1;
    public downloading_message: BehaviorSubject<string>;
    public timeSet:any;
    constructor(private _http: HttpClient) {
        this.url = Global.url;
        this.downloading_message = new BehaviorSubject<string>('Inicializando...');
    }

    generateExcel(AllTeachers, isPdf, turn) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
		this._http.get(this.url + 'get-logos', { headers: headers }).subscribe((logos:any) =>
        {
            this._http.get(this.url + 'get-general', { headers: headers }).subscribe((title:any) =>
            {
                this.logos = logos.documents;
                this.title = title.documents[0].documents_title;
                AllTeachers = AllTeachers.sort((a, b) => (a.lastnamep < b.lastnamep ? -1 : 1));
                if(turn == 'MATUTINO')
                {
                    this.timeSet = 
                    {
                        first: '07:00 - 07:50',
                        second: '07:50 - 08:40',
                        thirth: '08:40 - 09:30',
                        fourth: '09:30 - 10:20',
                        breaktime: '10:20 - 10:40',
                        fifth: '10:40 - 11:30',
                        sixth: '11:30 - 12:20',
                        seventh: '12:20 - 13:10',
                        eighth: '13:10 - 14:00'
                    }
                }
                if(turn == 'VESPERTINO')
                {
                    this.timeSet = 
                    {
                        first: '14:00 - 14:50',
                        second: '14:50 - 15:40',
                        thirth: '15:40 - 16:30',
                        fourth: '16:30 - 17:20',
                        breaktime: '17:20 - 17:40',
                        fifth: '17:40 - 18:30',
                        sixth: '18:30 - 19:20',
                        seventh: '19:20 - 20:10',
                        eighth: '20:10 - 21:00'
                    }
                }
                setTimeout(() => {
                    this.downloading_message.next("Conectando a la base de datos"); 
                }, 500);
                setTimeout(() => {
                    this.downloading_message.next("Leyendo información");
                }, 1000);
                setTimeout(() => {
                    if(!isPdf) this.downloading_message.next("Creando Excel");
                    if(isPdf) this.downloading_message.next("Creando PDF");
                }, 3000);
                let workbook = new Workbook();
                this.PageNumber = 1;
                let index1 = 0, index2 = 1, group1, group2;
                let isPair=(AllTeachers.length%2)?false:true;
                AllTeachers.forEach((Teacher) =>
                {
                    if(Teacher.turn == 'AMBOS') Teacher.turn = turn;
                });
                let interval = setInterval(() => {
                    group1 = AllTeachers[index1];
                    group2 = AllTeachers[index2];
                    if (index1 < AllTeachers.length - 1) if (this.createSheetByFourTeachers(workbook, group1, group2)) { index1 += 2; index2 += 2; this.PageNumber++; }
                    if(isPair){
                        if (index1 == AllTeachers.length) {
                            // SAVE
                            this.save(workbook, isPdf, turn);
                            clearInterval(interval);
                        }
                    }
                    if(!isPair){
                        if (index1 == AllTeachers.length-1) {
                            // SAVE
                            this.save(workbook, isPdf, turn);
                            clearInterval(interval);
                        }
                    }
                }, 1500);
            });
        });
    }

    save(workbook:any, isPdf:boolean, turn:string)
    {
        // SAVE
        workbook.xlsx.writeBuffer().then((data) => {
            this.downloading_message.next("Terminando Detalles...");
            this.createExcel(data, turn).subscribe(response => {
                this.downloading_message.next("Descargando...");
                this.downloadFile(response.filename, isPdf).subscribe(response => {
                    this.downloading_message.next("Archivo Descargado");
                    setTimeout(() => {
                        this.downloading_message.next("Inicializando...");
                    }, 300);
                    saveAs(response, 'HORARIO INDIVIDUAL - ' + turn);
                });
            });
        });
    }

    messageObservable = (): Observable<any> => {
        return this.downloading_message.asObservable();;
    }

    createExcel = (data, turn): Observable<any> => {
        let params =
        {
            data: data,
            turn: turn
        };
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<any[]>(this.url + 'create-general', params, { headers: headers });
    }

    downloadFile = (fileName, isPDF): Observable<any> => {
        return this._http.get(this.url + 'download-file/' + fileName + '/' + isPDF, { responseType: "blob", headers: new HttpHeaders().append("Content-Type", "application/json") });
    }

    createSheetByFourTeachers(workbook, teacher1, teacher2) {
        let worksheet = workbook.addWorksheet(this.PageNumber, { pageSetup: { orientation: 'landscape', scale: 64 } });
        worksheet.pageSetup.margins = {
            left: 0.0, right: 0.0,
            top: 0.0, bottom: 0.0,
            header: 0.0, footer: 0.0
        };
        // Blank Row
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

        // Add image 
        this.logos.forEach((Element:any)=>
        {
            if(Element.name == 'logoBase64_gob')
            {
                let header1 = workbook.addImage({
                    base64: Element.base64,
                    extension: 'png',
                });
                worksheet.addImage(header1, 'A1:B2');
                worksheet.addImage(header1, 'H1:I2');
            }
            if(Element.name == 'logoBase64_title')
            {
                let header2 = workbook.addImage({
                    base64: Element.base64,
                    extension: 'png',
                });
                worksheet.addImage(header2, 'E1:F2');
                worksheet.addImage(header2, 'L1:M2');
            }
        });
        
        //Add subtitle
        worksheet.addRow([]);
        worksheet.mergeCells('A3:F3');
        worksheet.getCell('F3').font = { size: 10 };
        worksheet.getCell('F3').alignment = { horizontal: 'center' };
        worksheet.getCell('F3').value = this.title;
        worksheet.mergeCells('H3:M3');
        worksheet.getCell('M3').font = { size: 10 };
        worksheet.getCell('M3').alignment = { horizontal: 'center' };
        worksheet.getCell('M3').value = this.title;

        //Add turn
        worksheet.addRow([]);
        worksheet.mergeCells('E4:F4');
        worksheet.getCell('F4').font = { size: 10 };
        worksheet.getCell('F4').alignment = { horizontal: 'center' };
        worksheet.getCell('F4').value = 'TURNO ' + teacher1.turn;
        worksheet.mergeCells('L4:M4');
        worksheet.getCell('M4').font = { size: 10 };
        worksheet.getCell('M4').alignment = { horizontal: 'center' };
        worksheet.getCell('M4').value = 'TURNO ' + teacher2.turn;

        //Add teacher
        worksheet.addRow([]);
        worksheet.getCell('A5').font = { size: 9, bold: true };
        worksheet.getCell('A5').value = 'PROFR. (A):';
        worksheet.getCell('B5').font = { size: 9 };
        worksheet.getCell('B5').value = teacher1.lastnamep+' '+teacher1.lastnamem+' '+teacher1.name;
        worksheet.getCell('H5').font = { size: 9, bold: true };
        worksheet.getCell('H5').value = 'PROFR. (A):';
        worksheet.getCell('I5').font = { size: 9 };
        worksheet.getCell('I5').value = teacher2.lastnamep+' '+teacher2.lastnamem+' '+teacher2.name;

        //Add Hours
        worksheet.addRow([]);
        worksheet.getCell('A6').font = { size: 9, bold: true };
        worksheet.getCell('A6').value = 'HORAS:';
        worksheet.getCell('B6').font = { size: 9 };
        worksheet.getCell('B6').value = teacher1.groups.length;
        worksheet.getCell('H6').font = { size: 9, bold: true };
        worksheet.getCell('H6').value = 'HORAS:';
        worksheet.getCell('I6').font = { size: 9 };
        worksheet.getCell('I6').value = teacher2.groups.length;

        //Add Empty Row
        worksheet.addRow([]);

        //Add Header Row
        worksheet.addRow([]);
        worksheet.getCell('A8').value = 'Horario';
        worksheet.getCell('B8').value = 'Lunes';
        worksheet.getCell('C8').value = 'Martes';
        worksheet.getCell('D8').value = 'Miercoles';
        worksheet.getCell('E8').value = 'Jueves';
        worksheet.getCell('F8').value = 'Viernes';
        worksheet.getCell('H8').value = 'Horario';
        worksheet.getCell('I8').value = 'Lunes';
        worksheet.getCell('J8').value = 'Martes';
        worksheet.getCell('K8').value = 'Miercoles';
        worksheet.getCell('L8').value = 'Jueves';
        worksheet.getCell('M8').value = 'Viernes';
        worksheet.getRow(8).alignment = { horizontal: 'center' };

        // SET FIRST CELLS
        this.setFirstTable(worksheet, teacher1);

        // SET SECOND TABLE
        this.setSecondTable(worksheet, teacher2);

        // SET COLUMN WIDTH
        worksheet.getColumn(1).width = 14;
        worksheet.getColumn(2).width = 14;
        worksheet.getColumn(3).width = 14;
        worksheet.getColumn(4).width = 14;
        worksheet.getColumn(5).width = 14;
        worksheet.getColumn(6).width = 14;
        worksheet.getColumn(7).width = 19.43;
        worksheet.getColumn(8).width = 14;
        worksheet.getColumn(9).width = 14;
        worksheet.getColumn(10).width = 14;
        worksheet.getColumn(11).width = 14;
        worksheet.getColumn(12).width = 14;
        worksheet.getColumn(13).width = 14;

        // SET ROW HEIGHT
        worksheet.getRow(1).height = 13.50;
        worksheet.getRow(2).height = 13.50;
        worksheet.getRow(3).height = 13.50;
        worksheet.getRow(4).height = 13.50;
        worksheet.getRow(5).height = 13.50;
        worksheet.getRow(6).height = 13.50;
        worksheet.getRow(7).height = 13.50;
        worksheet.getRow(8).height = 16.50;
        worksheet.getRow(9).height = 32.50;
        worksheet.getRow(10).height = 16.50;
        worksheet.getRow(11).height = 32.50;
        worksheet.getRow(12).height = 13.50;
        worksheet.getRow(13).height = 32.50;
        worksheet.getRow(14).height = 13.50;
        worksheet.getRow(15).height = 32.50;
        worksheet.getRow(16).height = 13.50;
        worksheet.getRow(17).height = 32.50;
        worksheet.getRow(18).height = 32.50;
        worksheet.getRow(19).height = 13.50;
        worksheet.getRow(20).height = 32.50;
        worksheet.getRow(21).height = 13.50;
        worksheet.getRow(22).height = 32.50;
        worksheet.getRow(23).height = 13.50;
        worksheet.getRow(24).height = 32.50;
        worksheet.getRow(25).height = 13.50;
        worksheet.getRow(26).height = 32.50;
        worksheet.getRow(27).height = 13.50;
        worksheet.getRow(28).height = 32.50;
        worksheet.getRow(29).height = 13.50;
        worksheet.getRow(30).height = 12.75;
        worksheet.getRow(31).height = 12.75;
        worksheet.getRow(32).height = 12.75;
        worksheet.getRow(33).height = 12.75;
        worksheet.getRow(34).height = 12.75;
        return true;
    }

    setFirstTable(worksheet, teacher) {
        //ROW 1
        worksheet.mergeCells('A9:A10');
        worksheet.getCell('A10').font = { size: 8 };
        worksheet.getCell('A10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(9).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(10).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A10').value = this.timeSet.first;
        // MONDAY 1
        worksheet.getCell('B9').font = { size: 9, bold: true };
        worksheet.getCell('B9').value = '';
        worksheet.getCell('B9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B10').font = { size: 10 };
        worksheet.getCell('B10').value = '';
        worksheet.getCell('B10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'MONDAY') {
                worksheet.getCell('B9').value = Element.subject;
                worksheet.getCell('B10').value = Element.id_group;
            }
        });
        // TUESDAY 1
        worksheet.getCell('C9').font = { size: 9, bold: true };
        worksheet.getCell('C9').value = '';
        worksheet.getCell('C9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C10').font = { size: 10 };
        worksheet.getCell('C10').value = '';
        worksheet.getCell('C10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'TUESDAY') {
                worksheet.getCell('C9').value = Element.subject;
                worksheet.getCell('C10').value = Element.id_group;
            }
        });
        // WEDNESDAY 1
        worksheet.getCell('D9').font = { size: 9, bold: true };
        worksheet.getCell('D9').value = '';
        worksheet.getCell('D9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D10').font = { size: 10 };
        worksheet.getCell('D10').value = '';
        worksheet.getCell('D10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D9').value = Element.subject;
                worksheet.getCell('D10').value = Element.id_group;
            }
        });
        // THURSDAY 1
        worksheet.getCell('E9').font = { size: 9, bold: true };
        worksheet.getCell('E9').value = '';
        worksheet.getCell('E9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E10').font = { size: 10 };
        worksheet.getCell('E10').value = '';
        worksheet.getCell('E10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'THURSDAY') {
                worksheet.getCell('E9').value = Element.subject;
                worksheet.getCell('E10').value = Element.id_group;
            }
        });
        // FRIDAY 1
        worksheet.getCell('F9').font = { size: 9, bold: true };
        worksheet.getCell('F9').value = '';
        worksheet.getCell('F9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F10').font = { size: 10 };
        worksheet.getCell('F10').value = '';
        worksheet.getCell('F10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'FRIDAY') {
                worksheet.getCell('F9').value = Element.subject;
                worksheet.getCell('F10').value = Element.id_group;
            }
        });

        //ROW 2
        worksheet.mergeCells('A11:A12');
        worksheet.getCell('A12').font = { size: 8 };
        worksheet.getCell('A12').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(11).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(12).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A12').value = this.timeSet.second;
        // MONDAY 2
        worksheet.getCell('B11').font = { size: 9, bold: true };
        worksheet.getCell('B11').value = '';
        worksheet.getCell('B11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B12').font = { size: 10 };
        worksheet.getCell('B12').value = '';
        worksheet.getCell('B12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'MONDAY') {
                worksheet.getCell('B11').value = Element.subject;
                worksheet.getCell('B12').value = Element.id_group;
            }
        });
        // TUESDAY 2
        worksheet.getCell('C11').font = { size: 9, bold: true };
        worksheet.getCell('C11').value = '';
        worksheet.getCell('C11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C12').font = { size: 10 };
        worksheet.getCell('C12').value = '';
        worksheet.getCell('C12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'TUESDAY') {
                worksheet.getCell('C11').value = Element.subject;
                worksheet.getCell('C12').value = Element.id_group;
            }
        });
        // WEDNESDAY 2
        worksheet.getCell('D11').font = { size: 9, bold: true };
        worksheet.getCell('D11').value = '';
        worksheet.getCell('D11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D12').font = { size: 10 };
        worksheet.getCell('D12').value = '';
        worksheet.getCell('D12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D11').value = Element.subject;
                worksheet.getCell('D12').value = Element.id_group;
            }
        });
        // THURSDAY 2
        worksheet.getCell('E11').font = { size: 9, bold: true };
        worksheet.getCell('E11').value = '';
        worksheet.getCell('E11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E12').font = { size: 10 };
        worksheet.getCell('E12').value = '';
        worksheet.getCell('E12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'THURSDAY') {
                worksheet.getCell('E11').value = Element.subject;
                worksheet.getCell('E12').value = Element.id_group;
            }
        });
        // FRIDAY 2
        worksheet.getCell('F11').font = { size: 9, bold: true };
        worksheet.getCell('F11').value = '';
        worksheet.getCell('F11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F12').font = { size: 10 };
        worksheet.getCell('F12').value = '';
        worksheet.getCell('F12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'FRIDAY') {
                worksheet.getCell('F11').value = Element.subject;
                worksheet.getCell('F12').value = Element.id_group;
            }
        });

        //ROW 3
        worksheet.mergeCells('A13:A14');
        worksheet.getCell('A14').font = { size: 8 };
        worksheet.getCell('A14').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(13).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(14).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A14').value = this.timeSet.thirth;
        // MONDAY 3
        worksheet.getCell('B13').font = { size: 9, bold: true };
        worksheet.getCell('B13').value = '';
        worksheet.getCell('B13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B14').font = { size: 10 };
        worksheet.getCell('B14').value = '';
        worksheet.getCell('B14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B13').value = Element.subject;
                worksheet.getCell('B14').value = Element.id_group;
            }
        });
        // TUESDAY 3
        worksheet.getCell('C13').font = { size: 9, bold: true };
        worksheet.getCell('C13').value = '';
        worksheet.getCell('C13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C14').font = { size: 10 };
        worksheet.getCell('C14').value = '';
        worksheet.getCell('C14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C13').value = Element.subject;
                worksheet.getCell('C14').value = Element.id_group;
            }
        });
        // WEDNESDAY 3
        worksheet.getCell('D13').font = { size: 9, bold: true };
        worksheet.getCell('D13').value = '';
        worksheet.getCell('D13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D14').font = { size: 10 };
        worksheet.getCell('D14').value = '';
        worksheet.getCell('D14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D13').value = Element.subject;
                worksheet.getCell('D14').value = Element.id_group;
            }
        });
        // THURSDAY 3
        worksheet.getCell('E13').font = { size: 9, bold: true };
        worksheet.getCell('E13').value = '';
        worksheet.getCell('E13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E14').font = { size: 10 };
        worksheet.getCell('E14').value = '';
        worksheet.getCell('E14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E13').value = Element.subject;
                worksheet.getCell('E14').value = Element.id_group;
            }
        });
        // FRIDAY 3
        worksheet.getCell('F13').font = { size: 9, bold: true };
        worksheet.getCell('F13').value = '';
        worksheet.getCell('F13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F14').font = { size: 10 };
        worksheet.getCell('F14').value = '';
        worksheet.getCell('F14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F13').value = Element.subject;
                worksheet.getCell('F14').value = Element.id_group;
            }
        });

        //ROW 4
        worksheet.mergeCells('A15:A16');
        worksheet.getCell('A16').font = { size: 8 };
        worksheet.getCell('A16').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(15).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(16).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A16').value = this.timeSet.fourth;
        // MONDAY 4
        worksheet.getCell('B15').font = { size: 9, bold: true };
        worksheet.getCell('B15').value = '';
        worksheet.getCell('B15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B16').font = { size: 10 };
        worksheet.getCell('B16').value = '';
        worksheet.getCell('B16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B15').value = Element.subject;
                worksheet.getCell('B16').value = Element.id_group;
            }
        });
        // TUESDAY 4
        worksheet.getCell('C15').font = { size: 9, bold: true };
        worksheet.getCell('C15').value = '';
        worksheet.getCell('C15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C16').font = { size: 10 };
        worksheet.getCell('C16').value = '';
        worksheet.getCell('C16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C15').value = Element.subject;
                worksheet.getCell('C16').value = Element.id_group;
            }
        });
        // WEDNESDAY 4
        worksheet.getCell('D15').font = { size: 9, bold: true };
        worksheet.getCell('D15').value = '';
        worksheet.getCell('D15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D16').font = { size: 10 };
        worksheet.getCell('D16').value = '';
        worksheet.getCell('D16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D15').value = Element.subject;
                worksheet.getCell('D16').value = Element.id_group;
            }
        });
        // THURSDAY 4
        worksheet.getCell('E15').font = { size: 9, bold: true };
        worksheet.getCell('E15').value = '';
        worksheet.getCell('E15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E16').font = { size: 10 };
        worksheet.getCell('E16').value = '';
        worksheet.getCell('E16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E15').value = Element.subject;
                worksheet.getCell('E16').value = Element.id_group;
            }
        });
        // FRIDAY 4
        worksheet.getCell('F15').font = { size: 9, bold: true };
        worksheet.getCell('F15').value = '';
        worksheet.getCell('F15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F16').font = { size: 10 };
        worksheet.getCell('F16').value = '';
        worksheet.getCell('F16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F15').value = Element.subject;
                worksheet.getCell('F16').value = Element.id_group;
            }
        });

        // ROW RECESO
        worksheet.getCell('A17').font = { size: 8 };
        worksheet.getCell('A17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.mergeCells('B17:F17');
        worksheet.getCell('F17').font = { size: 9 };
        worksheet.getCell('F17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(17).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A17').value = this.timeSet.breaktime;
        worksheet.getCell('F17').value = 'RECESO';

        //ROW 5
        worksheet.mergeCells('A18:A19');
        worksheet.getCell('A19').font = { size: 8 };
        worksheet.getCell('A19').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(18).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(19).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A19').value = this.timeSet.fifth;
        // MONDAY 5
        worksheet.getCell('B18').font = { size: 9, bold: true };
        worksheet.getCell('B18').value = '';
        worksheet.getCell('B18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B19').font = { size: 10 };
        worksheet.getCell('B19').value = '';
        worksheet.getCell('B19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B18').value = Element.subject;
                worksheet.getCell('B19').value = Element.id_group;
            }
        });
        // TUESDAY 5
        worksheet.getCell('C18').font = { size: 9, bold: true };
        worksheet.getCell('C18').value = '';
        worksheet.getCell('C18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C19').font = { size: 10 };
        worksheet.getCell('C19').value = '';
        worksheet.getCell('C19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C18').value = Element.subject;
                worksheet.getCell('C19').value = Element.id_group;
            }
        });
        // WEDNESDAY 5
        worksheet.getCell('D18').font = { size: 9, bold: true };
        worksheet.getCell('D18').value = '';
        worksheet.getCell('D18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D19').font = { size: 10 };
        worksheet.getCell('D19').value = '';
        worksheet.getCell('D19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D18').value = Element.subject;
                worksheet.getCell('D19').value = Element.id_group;
            }
        });
        // THURSDAY 5
        worksheet.getCell('E18').font = { size: 9, bold: true };
        worksheet.getCell('E18').value = '';
        worksheet.getCell('E18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E19').font = { size: 10 };
        worksheet.getCell('E19').value = '';
        worksheet.getCell('E19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E18').value = Element.subject;
                worksheet.getCell('E19').value = Element.id_group;
            }
        });
        // FRIDAY 5
        worksheet.getCell('F18').font = { size: 9, bold: true };
        worksheet.getCell('F18').value = '';
        worksheet.getCell('F18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F19').font = { size: 10 };
        worksheet.getCell('F19').value = '';
        worksheet.getCell('F19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F18').value = Element.subject;
                worksheet.getCell('F19').value = Element.id_group;
            }
        });

        //ROW 6
        worksheet.mergeCells('A20:A21');
        worksheet.getCell('A21').font = { size: 8 };
        worksheet.getCell('A21').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(20).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(21).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A21').value = this.timeSet.sixth;
        // MONDAY 6
        worksheet.getCell('B20').font = { size: 9, bold: true };
        worksheet.getCell('B20').value = '';
        worksheet.getCell('B20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B21').font = { size: 10 };
        worksheet.getCell('B21').value = '';
        worksheet.getCell('B21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B20').value = Element.subject;
                worksheet.getCell('B21').value = Element.id_group;
            }
        });
        // TUESDAY 6
        worksheet.getCell('C20').font = { size: 9, bold: true };
        worksheet.getCell('C20').value = '';
        worksheet.getCell('C20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C21').font = { size: 10 };
        worksheet.getCell('C21').value = '';
        worksheet.getCell('C21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C20').value = Element.subject;
                worksheet.getCell('C21').value = Element.id_group;
            }
        });
        // WEDNESDAY 6
        worksheet.getCell('D20').font = { size: 9, bold: true };
        worksheet.getCell('D20').value = '';
        worksheet.getCell('D20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D21').font = { size: 10 };
        worksheet.getCell('D21').value = '';
        worksheet.getCell('D21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D20').value = Element.subject;
                worksheet.getCell('D21').value = Element.id_group;
            }
        });
        // THURSDAY 6
        worksheet.getCell('E20').font = { size: 9, bold: true };
        worksheet.getCell('E20').value = '';
        worksheet.getCell('E20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E21').font = { size: 10 };
        worksheet.getCell('E21').value = '';
        worksheet.getCell('E21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E20').value = Element.subject;
                worksheet.getCell('E21').value = Element.id_group;
            }
        });
        // FRIDAY 6
        worksheet.getCell('F20').font = { size: 9, bold: true };
        worksheet.getCell('F20').value = '';
        worksheet.getCell('F20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F21').font = { size: 10 };
        worksheet.getCell('F21').value = '';
        worksheet.getCell('F21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F20').value = Element.subject;
                worksheet.getCell('F21').value = Element.id_group;
            }
        });

        //ROW 7
        worksheet.mergeCells('A22:A23');
        worksheet.getCell('A23').font = { size: 8 };
        worksheet.getCell('A23').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(22).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(23).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A23').value = this.timeSet.seventh;
        // MONDAY 7
        worksheet.getCell('B22').font = { size: 9, bold: true };
        worksheet.getCell('B22').value = '';
        worksheet.getCell('B22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B23').font = { size: 10 };
        worksheet.getCell('B23').value = '';
        worksheet.getCell('B23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B22').value = Element.subject;
                worksheet.getCell('B23').value = Element.id_group;
            }
        });
        // TUESDAY 7
        worksheet.getCell('C22').font = { size: 9, bold: true };
        worksheet.getCell('C22').value = '';
        worksheet.getCell('C22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C23').font = { size: 10 };
        worksheet.getCell('C23').value = '';
        worksheet.getCell('C23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C22').value = Element.subject;
                worksheet.getCell('C23').value = Element.id_group;
            }
        });
        // WEDNESDAY 7
        worksheet.getCell('D22').font = { size: 9, bold: true };
        worksheet.getCell('D22').value = '';
        worksheet.getCell('D22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D23').font = { size: 10 };
        worksheet.getCell('D23').value = '';
        worksheet.getCell('D23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('D22').value = Element.subject;
                worksheet.getCell('D23').value = Element.id_group;
            }
        });
        // THURSDAY 7
        worksheet.getCell('E22').font = { size: 9, bold: true };
        worksheet.getCell('E22').value = '';
        worksheet.getCell('E22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E23').font = { size: 10 };
        worksheet.getCell('E23').value = '';
        worksheet.getCell('E23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E22').value = Element.subject;
                worksheet.getCell('E23').value = Element.id_group;
            }
        });
        // FRIDAY 7
        worksheet.getCell('F22').font = { size: 9, bold: true };
        worksheet.getCell('F22').value = '';
        worksheet.getCell('F22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F23').font = { size: 10 };
        worksheet.getCell('F23').value = '';
        worksheet.getCell('F23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F22').value = Element.subject;
                worksheet.getCell('F23').value = Element.id_group;
            }
        });

        //ROW 8
        worksheet.mergeCells('A24:A25');
        worksheet.getCell('A25').font = { size: 8 };
        worksheet.getCell('A25').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(24).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(25).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('A25').value = this.timeSet.eighth;
        // MONDAY 8
        worksheet.getCell('B24').font = { size: 9, bold: true };
        worksheet.getCell('B24').value = '';
        worksheet.getCell('B24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B25').font = { size: 10 };
        worksheet.getCell('B25').value = '';
        worksheet.getCell('B25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'MONDAY') {
                worksheet.getCell('B24').value = Element.subject;
                worksheet.getCell('B25').value = Element.id_group;
            }
        });
        // TUESDAY 8
        worksheet.getCell('C24').font = { size: 9, bold: true };
        worksheet.getCell('C24').value = '';
        worksheet.getCell('C24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C25').font = { size: 10 };
        worksheet.getCell('C25').value = '';
        worksheet.getCell('C25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('C24').value = Element.subject;
                worksheet.getCell('C25').value = Element.id_group;
            }
        });
        // MIERCOLES 8
        worksheet.getCell('D24').font = { size: 9, bold: true };
        worksheet.getCell('D24').value = '';
        worksheet.getCell('D24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D25').font = { size: 10 };
        worksheet.getCell('D25').value = '';
        worksheet.getCell('D25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'MIERCOLES') {
                worksheet.getCell('D24').value = Element.subject;
                worksheet.getCell('D25').value = Element.id_group;
            }
        });
        // THURSDAY 8
        worksheet.getCell('E24').font = { size: 9, bold: true };
        worksheet.getCell('E24').value = '';
        worksheet.getCell('E24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E25').font = { size: 10 };
        worksheet.getCell('E25').value = '';
        worksheet.getCell('E25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('E24').value = Element.subject;
                worksheet.getCell('E25').value = Element.id_group;
            }
        });
        // FRIDAY 8
        worksheet.getCell('F24').font = { size: 9, bold: true };
        worksheet.getCell('F24').value = '';
        worksheet.getCell('F24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F25').font = { size: 10 };
        worksheet.getCell('F25').value = '';
        worksheet.getCell('F25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('F24').value = Element.subject;
                worksheet.getCell('F25').value = Element.id_group;
            }
        });
    }

    setSecondTable(worksheet, teacher) {
        //ROW 1
        worksheet.mergeCells('H9:H10');
        worksheet.getCell('H10').font = { size: 8 };
        worksheet.getCell('H10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(9).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(10).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H10').value = this.timeSet.first;
        // MONDAY 1
        worksheet.getCell('I9').font = { size: 9, bold: true };
        worksheet.getCell('I9').value = '';
        worksheet.getCell('I9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I10').font = { size: 10 };
        worksheet.getCell('I10').value = '';
        worksheet.getCell('I10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'MONDAY') {
                worksheet.getCell('I9').value = Element.subject;
                worksheet.getCell('I10').value = Element.id_group;
            }
        });
        // TUESDAY 1
        worksheet.getCell('J9').font = { size: 9, bold: true };
        worksheet.getCell('J9').value = '';
        worksheet.getCell('J9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J10').font = { size: 10 };
        worksheet.getCell('J10').value = '';
        worksheet.getCell('J10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'TUESDAY') {
                worksheet.getCell('J9').value = Element.subject;
                worksheet.getCell('J10').value = Element.id_group;
            }
        });
        // WEDNESDAY 1
        worksheet.getCell('K9').font = { size: 9, bold: true };
        worksheet.getCell('K9').value = '';
        worksheet.getCell('K9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K10').font = { size: 10 };
        worksheet.getCell('K10').value = '';
        worksheet.getCell('K10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K9').value = Element.subject;
                worksheet.getCell('K10').value = Element.id_group;
            }
        });
        // THURSDAY 1
        worksheet.getCell('L9').font = { size: 9, bold: true };
        worksheet.getCell('L9').value = '';
        worksheet.getCell('L9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L10').font = { size: 10 };
        worksheet.getCell('L10').value = '';
        worksheet.getCell('L10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'THURSDAY') {
                worksheet.getCell('L9').value = Element.subject;
                worksheet.getCell('L10').value = Element.id_group;
            }
        });
        // FRIDAY 1
        worksheet.getCell('M9').font = { size: 9, bold: true };
        worksheet.getCell('M9').value = '';
        worksheet.getCell('M9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M10').font = { size: 10 };
        worksheet.getCell('M10').value = '';
        worksheet.getCell('M10').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIRST' && Element.day == 'FRIDAY') {
                worksheet.getCell('M9').value = Element.subject;
                worksheet.getCell('M10').value = Element.id_group;
            }
        });

        //ROW 2
        worksheet.mergeCells('H11:H12');
        worksheet.getCell('H12').font = { size: 8 };
        worksheet.getCell('H12').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(11).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(12).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H12').value = this.timeSet.second;
        // MONDAY 2
        worksheet.getCell('I11').font = { size: 9, bold: true };
        worksheet.getCell('I11').value = '';
        worksheet.getCell('I11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I12').font = { size: 10 };
        worksheet.getCell('I12').value = '';
        worksheet.getCell('I12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'MONDAY') {
                worksheet.getCell('I11').value = Element.subject;
                worksheet.getCell('I12').value = Element.id_group;
            }
        });
        // TUESDAY 2
        worksheet.getCell('J11').font = { size: 9, bold: true };
        worksheet.getCell('J11').value = '';
        worksheet.getCell('J11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J12').font = { size: 10 };
        worksheet.getCell('J12').value = '';
        worksheet.getCell('J12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'TUESDAY') {
                worksheet.getCell('J11').value = Element.subject;
                worksheet.getCell('J12').value = Element.id_group;
            }
        });
        // WEDNESDAY 2
        worksheet.getCell('K11').font = { size: 9, bold: true };
        worksheet.getCell('K11').value = '';
        worksheet.getCell('K11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K12').font = { size: 10 };
        worksheet.getCell('K12').value = '';
        worksheet.getCell('K12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K11').value = Element.subject;
                worksheet.getCell('K12').value = Element.id_group;
            }
        });
        // THURSDAY 2
        worksheet.getCell('L11').font = { size: 9, bold: true };
        worksheet.getCell('L11').value = '';
        worksheet.getCell('L11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L12').font = { size: 10 };
        worksheet.getCell('L12').value = '';
        worksheet.getCell('L12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'THURSDAY') {
                worksheet.getCell('L11').value = Element.subject;
                worksheet.getCell('L12').value = Element.id_group;
            }
        });
        // FRIDAY 2
        worksheet.getCell('M11').font = { size: 9, bold: true };
        worksheet.getCell('M11').value = '';
        worksheet.getCell('M11').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M12').font = { size: 10 };
        worksheet.getCell('M12').value = '';
        worksheet.getCell('M12').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SECOND' && Element.day == 'FRIDAY') {
                worksheet.getCell('M11').value = Element.subject;
                worksheet.getCell('M12').value = Element.id_group;
            }
        });

        //ROW 3
        worksheet.mergeCells('H13:H14');
        worksheet.getCell('H14').font = { size: 8 };
        worksheet.getCell('H14').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(13).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(14).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H14').value = this.timeSet.thirth;
        // MONDAY 3
        worksheet.getCell('I13').font = { size: 9, bold: true };
        worksheet.getCell('I13').value = '';
        worksheet.getCell('I13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I14').font = { size: 10 };
        worksheet.getCell('I14').value = '';
        worksheet.getCell('I14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I13').value = Element.subject;
                worksheet.getCell('I14').value = Element.id_group;
            }
        });
        // TUESDAY 3
        worksheet.getCell('J13').font = { size: 9, bold: true };
        worksheet.getCell('J13').value = '';
        worksheet.getCell('J13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J14').font = { size: 10 };
        worksheet.getCell('J14').value = '';
        worksheet.getCell('J14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J13').value = Element.subject;
                worksheet.getCell('J14').value = Element.id_group;
            }
        });
        // WEDNESDAY 3
        worksheet.getCell('K13').font = { size: 9, bold: true };
        worksheet.getCell('K13').value = '';
        worksheet.getCell('K13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K14').font = { size: 10 };
        worksheet.getCell('K14').value = '';
        worksheet.getCell('K14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K13').value = Element.subject;
                worksheet.getCell('K14').value = Element.id_group;
            }
        });
        // THURSDAY 3
        worksheet.getCell('L13').font = { size: 9, bold: true };
        worksheet.getCell('L13').value = '';
        worksheet.getCell('L13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L14').font = { size: 10 };
        worksheet.getCell('L14').value = '';
        worksheet.getCell('L14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L13').value = Element.subject;
                worksheet.getCell('L14').value = Element.id_group;
            }
        });
        // FRIDAY 3
        worksheet.getCell('M13').font = { size: 9, bold: true };
        worksheet.getCell('M13').value = '';
        worksheet.getCell('M13').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M14').font = { size: 10 };
        worksheet.getCell('M14').value = '';
        worksheet.getCell('M14').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'THIRTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M13').value = Element.subject;
                worksheet.getCell('M14').value = Element.id_group;
            }
        });

        //ROW 4
        worksheet.mergeCells('H15:H16');
        worksheet.getCell('H16').font = { size: 8 };
        worksheet.getCell('H16').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(15).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(16).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H16').value = this.timeSet.fourth;
        // MONDAY 4
        worksheet.getCell('I15').font = { size: 9, bold: true };
        worksheet.getCell('I15').value = '';
        worksheet.getCell('I15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I16').font = { size: 10 };
        worksheet.getCell('I16').value = '';
        worksheet.getCell('I16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I15').value = Element.subject;
                worksheet.getCell('I16').value = Element.id_group;
            }
        });
        // TUESDAY 4
        worksheet.getCell('J15').font = { size: 9, bold: true };
        worksheet.getCell('J15').value = '';
        worksheet.getCell('J15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J16').font = { size: 10 };
        worksheet.getCell('J16').value = '';
        worksheet.getCell('J16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J15').value = Element.subject;
                worksheet.getCell('J16').value = Element.id_group;
            }
        });
        // WEDNESDAY 4
        worksheet.getCell('K15').font = { size: 9, bold: true };
        worksheet.getCell('K15').value = '';
        worksheet.getCell('K15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K16').font = { size: 10 };
        worksheet.getCell('K16').value = '';
        worksheet.getCell('K16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K15').value = Element.subject;
                worksheet.getCell('K16').value = Element.id_group;
            }
        });
        // THURSDAY 4
        worksheet.getCell('L15').font = { size: 9, bold: true };
        worksheet.getCell('L15').value = '';
        worksheet.getCell('L15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L16').font = { size: 10 };
        worksheet.getCell('L16').value = '';
        worksheet.getCell('L16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L15').value = Element.subject;
                worksheet.getCell('L16').value = Element.id_group;
            }
        });
        // FRIDAY 4
        worksheet.getCell('M15').font = { size: 9, bold: true };
        worksheet.getCell('M15').value = '';
        worksheet.getCell('M15').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M16').font = { size: 10 };
        worksheet.getCell('M16').value = '';
        worksheet.getCell('M16').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FOURTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M15').value = Element.subject;
                worksheet.getCell('M16').value = Element.id_group;
            }
        });

        // ROW RECESO
        worksheet.getCell('H17').font = { size: 8 };
        worksheet.getCell('H17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.mergeCells('I17:M17');
        worksheet.getCell('M17').font = { size: 9 };
        worksheet.getCell('M17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(17).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('H17').value = this.timeSet.breaktime;
        worksheet.getCell('M17').value = 'RECESO';

        //ROW 5
        worksheet.mergeCells('H18:H19');
        worksheet.getCell('H19').font = { size: 8 };
        worksheet.getCell('H19').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(18).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(19).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H19').value = this.timeSet.fifth;
        // MONDAY 5
        worksheet.getCell('I18').font = { size: 9, bold: true };
        worksheet.getCell('I18').value = '';
        worksheet.getCell('I18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I19').font = { size: 10 };
        worksheet.getCell('I19').value = '';
        worksheet.getCell('I19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I18').value = Element.subject;
                worksheet.getCell('I19').value = Element.id_group;
            }
        });
        // TUESDAY 5
        worksheet.getCell('J18').font = { size: 9, bold: true };
        worksheet.getCell('J18').value = '';
        worksheet.getCell('J18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J19').font = { size: 10 };
        worksheet.getCell('J19').value = '';
        worksheet.getCell('J19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J18').value = Element.subject;
                worksheet.getCell('J19').value = Element.id_group;
            }
        });
        // WEDNESDAY 5
        worksheet.getCell('K18').font = { size: 9, bold: true };
        worksheet.getCell('K18').value = '';
        worksheet.getCell('K18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K19').font = { size: 10 };
        worksheet.getCell('K19').value = '';
        worksheet.getCell('K19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K18').value = Element.subject;
                worksheet.getCell('K19').value = Element.id_group;
            }
        });
        // THURSDAY 5
        worksheet.getCell('L18').font = { size: 9, bold: true };
        worksheet.getCell('L18').value = '';
        worksheet.getCell('L18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L19').font = { size: 10 };
        worksheet.getCell('L19').value = '';
        worksheet.getCell('L19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L18').value = Element.subject;
                worksheet.getCell('L19').value = Element.id_group;
            }
        });
        // FRIDAY 5
        worksheet.getCell('M18').font = { size: 9, bold: true };
        worksheet.getCell('M18').value = '';
        worksheet.getCell('M18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M19').font = { size: 10 };
        worksheet.getCell('M19').value = '';
        worksheet.getCell('M19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'FIFTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M18').value = Element.subject;
                worksheet.getCell('M19').value = Element.id_group;
            }
        });

        //ROW 6
        worksheet.mergeCells('H20:H21');
        worksheet.getCell('H21').font = { size: 8 };
        worksheet.getCell('H21').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(20).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(21).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H21').value = this.timeSet.sixth;
        // MONDAY 6
        worksheet.getCell('I20').font = { size: 9, bold: true };
        worksheet.getCell('I20').value = '';
        worksheet.getCell('I20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I21').font = { size: 10 };
        worksheet.getCell('I21').value = '';
        worksheet.getCell('I21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I20').value = Element.subject;
                worksheet.getCell('I21').value = Element.id_group;
            }
        });
        // TUESDAY 6
        worksheet.getCell('J20').font = { size: 9, bold: true };
        worksheet.getCell('J20').value = '';
        worksheet.getCell('J20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J21').font = { size: 10 };
        worksheet.getCell('J21').value = '';
        worksheet.getCell('J21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J20').value = Element.subject;
                worksheet.getCell('J21').value = Element.id_group;
            }
        });
        // WEDNESDAY 6
        worksheet.getCell('K20').font = { size: 9, bold: true };
        worksheet.getCell('K20').value = '';
        worksheet.getCell('K20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K21').font = { size: 10 };
        worksheet.getCell('K21').value = '';
        worksheet.getCell('K21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K20').value = Element.subject;
                worksheet.getCell('K21').value = Element.id_group;
            }
        });
        // THURSDAY 6
        worksheet.getCell('L20').font = { size: 9, bold: true };
        worksheet.getCell('L20').value = '';
        worksheet.getCell('L20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L21').font = { size: 10 };
        worksheet.getCell('L21').value = '';
        worksheet.getCell('L21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L20').value = Element.subject;
                worksheet.getCell('L21').value = Element.id_group;
            }
        });
        // FRIDAY 6
        worksheet.getCell('M20').font = { size: 9, bold: true };
        worksheet.getCell('M20').value = '';
        worksheet.getCell('M20').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M21').font = { size: 10 };
        worksheet.getCell('M21').value = '';
        worksheet.getCell('M21').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SIXTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M20').value = Element.subject;
                worksheet.getCell('M21').value = Element.id_group;
            }
        });

        //ROW 7
        worksheet.mergeCells('H22:H23');
        worksheet.getCell('H23').font = { size: 8 };
        worksheet.getCell('H23').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(22).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(23).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H23').value = this.timeSet.seventh;
        // MONDAY 7
        worksheet.getCell('I22').font = { size: 9, bold: true };
        worksheet.getCell('I22').value = '';
        worksheet.getCell('I22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I23').font = { size: 10 };
        worksheet.getCell('I23').value = '';
        worksheet.getCell('I23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I22').value = Element.subject;
                worksheet.getCell('I23').value = Element.id_group;
            }
        });
        // TUESDAY 7
        worksheet.getCell('J22').font = { size: 9, bold: true };
        worksheet.getCell('J22').value = '';
        worksheet.getCell('J22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J23').font = { size: 10 };
        worksheet.getCell('J23').value = '';
        worksheet.getCell('J23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J22').value = Element.subject;
                worksheet.getCell('J23').value = Element.id_group;
            }
        });
        // WEDNESDAY 7
        worksheet.getCell('K22').font = { size: 9, bold: true };
        worksheet.getCell('K22').value = '';
        worksheet.getCell('K22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K23').font = { size: 10 };
        worksheet.getCell('K23').value = '';
        worksheet.getCell('K23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'WEDNESDAY') {
                worksheet.getCell('K22').value = Element.subject;
                worksheet.getCell('K23').value = Element.id_group;
            }
        });
        // THURSDAY 7
        worksheet.getCell('L22').font = { size: 9, bold: true };
        worksheet.getCell('L22').value = '';
        worksheet.getCell('L22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L23').font = { size: 10 };
        worksheet.getCell('L23').value = '';
        worksheet.getCell('L23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L22').value = Element.subject;
                worksheet.getCell('L23').value = Element.id_group;
            }
        });
        // FRIDAY 7
        worksheet.getCell('M22').font = { size: 9, bold: true };
        worksheet.getCell('M22').value = '';
        worksheet.getCell('M22').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M23').font = { size: 10 };
        worksheet.getCell('M23').value = '';
        worksheet.getCell('M23').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'SEVENTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M22').value = Element.subject;
                worksheet.getCell('M23').value = Element.id_group;
            }
        });

        //ROW 8
        worksheet.mergeCells('H24:H25');
        worksheet.getCell('H25').font = { size: 8 };
        worksheet.getCell('H25').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(24).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(25).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('H25').value = this.timeSet.eighth;
        // MONDAY 8
        worksheet.getCell('I24').font = { size: 9, bold: true };
        worksheet.getCell('I24').value = '';
        worksheet.getCell('I24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I25').font = { size: 10 };
        worksheet.getCell('I25').value = '';
        worksheet.getCell('I25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'MONDAY') {
                worksheet.getCell('I24').value = Element.subject;
                worksheet.getCell('I25').value = Element.id_group;
            }
        });
        // TUESDAY 8
        worksheet.getCell('J24').font = { size: 9, bold: true };
        worksheet.getCell('J24').value = '';
        worksheet.getCell('J24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J25').font = { size: 10 };
        worksheet.getCell('J25').value = '';
        worksheet.getCell('J25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'TUESDAY') {
                worksheet.getCell('J24').value = Element.subject;
                worksheet.getCell('J25').value = Element.id_group;
            }
        });
        // MIERCOLES 8
        worksheet.getCell('K24').font = { size: 9, bold: true };
        worksheet.getCell('K24').value = '';
        worksheet.getCell('K24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K25').font = { size: 10 };
        worksheet.getCell('K25').value = '';
        worksheet.getCell('K25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'MIERCOLES') {
                worksheet.getCell('K24').value = Element.subject;
                worksheet.getCell('K25').value = Element.id_group;
            }
        });
        // THURSDAY 8
        worksheet.getCell('L24').font = { size: 9, bold: true };
        worksheet.getCell('L24').value = '';
        worksheet.getCell('L24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L25').font = { size: 10 };
        worksheet.getCell('L25').value = '';
        worksheet.getCell('L25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'THURSDAY') {
                worksheet.getCell('L24').value = Element.subject;
                worksheet.getCell('L25').value = Element.id_group;
            }
        });
        // FRIDAY 8
        worksheet.getCell('M24').font = { size: 9, bold: true };
        worksheet.getCell('M24').value = '';
        worksheet.getCell('M24').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M25').font = { size: 10 };
        worksheet.getCell('M25').value = '';
        worksheet.getCell('M25').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        teacher.groups.forEach((Element) => {
            if (Element.hour == 'EIGHTH' && Element.day == 'FRIDAY') {
                worksheet.getCell('M24').value = Element.subject;
                worksheet.getCell('M25').value = Element.id_group;
            }
        });
    }
}