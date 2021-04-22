import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Global } from './global';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

@Injectable({
    providedIn: 'root'
})
export class ExcelGeneralService {
    public url: string;
    public logos:any;
    public title:string = '';
    public downloading_message: BehaviorSubject<string>;
    public timeSet:any;
    constructor(private _http: HttpClient) {
        this.url = Global.url;
        this.downloading_message = new BehaviorSubject<string>('Inicializando...');
    }

    generateExcel(AllGroups, isPdf, turn) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        this._http.get(this.url + 'get-logos', { headers: headers }).subscribe((logos:any) =>
        {
            this._http.get(this.url + 'get-general', { headers: headers }).subscribe((title:any) =>
            {
                this.logos = logos.documents;
                this.title = title.documents[0].documents_title;
                if(AllGroups[0].turn == 'MATUTINO')
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
                if(AllGroups[0].turn == 'VESPERTINO')
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
                let index1 = 0, index2 = 1, group1, group2;
                let isPair=(AllGroups.length%2)?false:true;
                AllGroups.forEach((Group) =>
                {
                    if(Group.turn == 'AMBOS') Group.turn = turn;
                });
                let interval = setInterval(() => {
                    group1 = AllGroups[index1];
                    group2 = AllGroups[index2];
                    if (index1 < AllGroups.length - 1) if (this.createSheetByTwoGroups(workbook, group1, group2)) { index1 += 2; index2 += 2 }
                    if(isPair){
                        if (index1 == AllGroups.length) {
                            // SAVE
                            this.save(workbook, isPdf, turn);
                            clearInterval(interval);
                        }
                    }
                    if(!isPair){
                        if (index1 == AllGroups.length-1) {
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
                    saveAs(response, 'HORARIO GENERAL - ' + turn);
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

    createSheetByTwoGroups(workbook, group1, group2) {
        let worksheet = workbook.addWorksheet('Orientador (' + group1.gen + '-' + group1.group + ';' + group2.gen + '-' + group2.group + ')', { pageSetup: { orientation: 'landscape', scale: 64 } });
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
                worksheet.addImage(header1, 'B2:C4');
                worksheet.addImage(header1, 'I2:J4');
            }
            if(Element.name == 'logoBase64_title')
            {
                let header2 = workbook.addImage({
                    base64: Element.base64,
                    extension: 'png',
                });
                worksheet.addImage(header2, 'F2:G4');
                worksheet.addImage(header2, 'M2:N4');
            }
            if(Element.name == 'logoBase64_logo')
            {
                let logo = workbook.addImage({
                    base64: Element.base64,
                    extension: 'png',
                });
                worksheet.addImage(logo, 'G7:G9');
                worksheet.addImage(logo, 'N7:N9');
            }
            if(Element.name == 'logoBase64_footer')
            {
                let footer = workbook.addImage({
                    base64: Element.base64,
                    extension: 'png',
                });
                worksheet.addImage(footer, 'B30:G34');
                worksheet.addImage(footer, 'I30:N34');
            }
        });

        //Add subtitle
        worksheet.addRow([]);
        worksheet.mergeCells('C5:F5');
        worksheet.getCell('F5').font = { size: 10 };
        worksheet.getCell('F5').alignment = { horizontal: 'center' };
        worksheet.getCell('F5').value = this.title;
        worksheet.mergeCells('J5:M5');
        worksheet.getCell('M5').font = { size: 10 };
        worksheet.getCell('M5').alignment = { horizontal: 'center' };
        worksheet.getCell('M5').value = this.title;

        //Add turn
        worksheet.addRow([]);
        worksheet.mergeCells('C6:F6');
        worksheet.getCell('F6').font = { size: 10 };
        worksheet.getCell('F6').alignment = { horizontal: 'center' };
        worksheet.getCell('F6').value = 'Escuela Preparatoria Oficial Núm. 114';
        worksheet.getCell('G6').font = { size: 10 };
        worksheet.getCell('G6').value = 'TURNO ' + group1.turn;
        worksheet.mergeCells('J6:M6');
        worksheet.getCell('M6').font = { size: 10 };
        worksheet.getCell('M6').alignment = { horizontal: 'center' };
        worksheet.getCell('M6').value = 'Escuela Preparatoria Oficial Núm. 114';
        worksheet.getCell('N6').font = { size: 10 };
        worksheet.getCell('N6').value = 'TURNO ' + group2.turn;

        //Add counselor
        worksheet.addRow([]);
        worksheet.getCell('C7').font = { size: 9, bold: true };
        worksheet.getCell('C7').value = 'PROFR. (A):';
        worksheet.getCell('D7').font = { size: 9 };
        worksheet.getCell('D7').value = group1.counselor;
        worksheet.getCell('J7').font = { size: 9, bold: true };
        worksheet.getCell('J7').value = 'PROFR. (A):';
        worksheet.getCell('K7').font = { size: 9 };
        worksheet.getCell('K7').value = group2.counselor;

        //Add subject
        worksheet.addRow([]);
        worksheet.getCell('C8').font = { size: 9, bold: true };
        worksheet.getCell('C8').value = 'ASIGNATURAS:';
        worksheet.getCell('D8').font = { size: 9 };
        worksheet.getCell('D8').value = 'HORARIO GENERAL';
        worksheet.getCell('J8').font = { size: 9, bold: true };
        worksheet.getCell('J8').value = 'ASIGNATURAS:';
        worksheet.getCell('K8').font = { size: 9 };
        worksheet.getCell('K8').value = 'HORARIO GENERAL';

        //Add Group
        worksheet.addRow([]);
        worksheet.getCell('C9').font = { size: 9, bold: true };
        worksheet.getCell('C9').value = 'GRUPOS:';
        worksheet.getCell('D9').font = { size: 9 };
        worksheet.getCell('D9').value = 'GRADO ' + group1.gen + ' GRUPO ' + group1.group;
        worksheet.getCell('J9').font = { size: 9, bold: true };
        worksheet.getCell('J9').value = 'GRUPOS:';
        worksheet.getCell('K9').font = { size: 9 };
        worksheet.getCell('K9').value = 'GRADO ' + group2.gen + ' GRUPO ' + group2.group;

        //Add Empty Row
        worksheet.addRow([]);

        //Add Header Row
        worksheet.addRow([]);
        worksheet.getCell('B11').value = 'Horario';
        worksheet.getCell('C11').value = 'Lunes';
        worksheet.getCell('D11').value = 'Martes';
        worksheet.getCell('E11').value = 'Miercoles';
        worksheet.getCell('F11').value = 'Jueves';
        worksheet.getCell('G11').value = 'Viernes';
        worksheet.getCell('I11').value = 'Horario';
        worksheet.getCell('J11').value = 'Lunes';
        worksheet.getCell('K11').value = 'Martes';
        worksheet.getCell('L11').value = 'Miercoles';
        worksheet.getCell('M11').value = 'Jueves';
        worksheet.getCell('N11').value = 'Viernes';
        worksheet.getRow(11).alignment = { horizontal: 'center' };

        // SET FIRST CELLS
        this.setFirstTable(worksheet, group1);

        // SET SECOND TABLE
        this.setSecondTable(worksheet, group2);

        // SET COLUMN WIDTH
        worksheet.getColumn(1).width = 1;
        worksheet.getColumn(2).width = 8.50;
        worksheet.getColumn(3).width = 18;
        worksheet.getColumn(4).width = 18;
        worksheet.getColumn(5).width = 18;
        worksheet.getColumn(6).width = 18;
        worksheet.getColumn(7).width = 18;
        worksheet.getColumn(8).width = 1;
        worksheet.getColumn(9).width = 8.50;
        worksheet.getColumn(10).width = 18;
        worksheet.getColumn(11).width = 18;
        worksheet.getColumn(12).width = 18;
        worksheet.getColumn(13).width = 18;
        worksheet.getColumn(14).width = 18;

        // SET ROW HEIGHT
        worksheet.getRow(1).height = 7.50;
        worksheet.getRow(2).height = 12.75;
        worksheet.getRow(3).height = 12.75;
        worksheet.getRow(4).height = 12.75;
        worksheet.getRow(5).height = 12.75;
        worksheet.getRow(6).height = 12.75;
        worksheet.getRow(7).height = 12.75;
        worksheet.getRow(8).height = 12.75;
        worksheet.getRow(9).height = 12.75;
        worksheet.getRow(10).height = 7.50;
        worksheet.getRow(11).height = 12.75;
        worksheet.getRow(12).height = 36;
        worksheet.getRow(13).height = 38.25;
        worksheet.getRow(14).height = 36;
        worksheet.getRow(15).height = 38.25;
        worksheet.getRow(16).height = 36;
        worksheet.getRow(17).height = 38.25;
        worksheet.getRow(18).height = 36;
        worksheet.getRow(19).height = 38.25;
        worksheet.getRow(20).height = 12;
        worksheet.getRow(21).height = 36;
        worksheet.getRow(22).height = 42;
        worksheet.getRow(23).height = 36;
        worksheet.getRow(24).height = 42;
        worksheet.getRow(25).height = 36;
        worksheet.getRow(26).height = 40;
        worksheet.getRow(27).height = 36;
        worksheet.getRow(28).height = 38.25;
        worksheet.getRow(29).height = 12.75;
        worksheet.getRow(30).height = 12.75;
        worksheet.getRow(31).height = 12.75;
        worksheet.getRow(32).height = 12.75;
        worksheet.getRow(33).height = 12.75;
        return true;
    }

    setFirstTable(worksheet, group) {
        //ROW 1
        worksheet.mergeCells('B12:B13');
        worksheet.getCell('B13').font = { size: 8 };
        worksheet.getCell('B13').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(12).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(13).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B13').value = this.timeSet.first;
        // MONDAY 1
        worksheet.getCell('C12').font = { size: 9, bold: true };
        worksheet.getCell('C12').value = '';
        worksheet.getCell('C12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C13').font = { size: 10 };
        worksheet.getCell('C13').value = '';
        worksheet.getCell('C13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('C12').value = Element.subject;
                worksheet.getCell('C13').value = Element.teacher_id;
            }
        });
        // TUESDAY 1
        worksheet.getCell('D12').font = { size: 9, bold: true };
        worksheet.getCell('D12').value = '';
        worksheet.getCell('D12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D13').font = { size: 10 };
        worksheet.getCell('D13').value = '';
        worksheet.getCell('D13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('D12').value = Element.subject;
                worksheet.getCell('D13').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 1
        worksheet.getCell('E12').font = { size: 9, bold: true };
        worksheet.getCell('E12').value = '';
        worksheet.getCell('E12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E13').font = { size: 10 };
        worksheet.getCell('E13').value = '';
        worksheet.getCell('E13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('E12').value = Element.subject;
                worksheet.getCell('E13').value = Element.teacher_id;
            }
        });
        // THURSDAY 1
        worksheet.getCell('F12').font = { size: 9, bold: true };
        worksheet.getCell('F12').value = '';
        worksheet.getCell('F12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F13').font = { size: 10 };
        worksheet.getCell('F13').value = '';
        worksheet.getCell('F13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('F12').value = Element.subject;
                worksheet.getCell('F13').value = Element.teacher_id;
            }
        });
        // FRIDAY 1
        worksheet.getCell('G12').font = { size: 9, bold: true };
        worksheet.getCell('G12').value = '';
        worksheet.getCell('G12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G13').font = { size: 10 };
        worksheet.getCell('G13').value = '';
        worksheet.getCell('G13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('G12').value = Element.subject;
                worksheet.getCell('G13').value = Element.teacher_id;
            }
        });

        //ROW 2
        worksheet.mergeCells('B14:B15');
        worksheet.getCell('B15').font = { size: 8 };
        worksheet.getCell('B15').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(14).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(15).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B15').value = this.timeSet.second;
        // MONDAY 2
        worksheet.getCell('C14').font = { size: 9, bold: true };
        worksheet.getCell('C14').value = '';
        worksheet.getCell('C14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C15').font = { size: 10 };
        worksheet.getCell('C15').value = '';
        worksheet.getCell('C15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('C14').value = Element.subject;
                worksheet.getCell('C15').value = Element.teacher_id;
            }
        });
        // TUESDAY 2
        worksheet.getCell('D14').font = { size: 9, bold: true };
        worksheet.getCell('D14').value = '';
        worksheet.getCell('D14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D15').font = { size: 10 };
        worksheet.getCell('D15').value = '';
        worksheet.getCell('D15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('D14').value = Element.subject;
                worksheet.getCell('D15').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 2
        worksheet.getCell('E14').font = { size: 9, bold: true };
        worksheet.getCell('E14').value = '';
        worksheet.getCell('E14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E15').font = { size: 10 };
        worksheet.getCell('E15').value = '';
        worksheet.getCell('E15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('E14').value = Element.subject;
                worksheet.getCell('E15').value = Element.teacher_id;
            }
        });
        // THURSDAY 2
        worksheet.getCell('F14').font = { size: 9, bold: true };
        worksheet.getCell('F14').value = '';
        worksheet.getCell('F14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F15').font = { size: 10 };
        worksheet.getCell('F15').value = '';
        worksheet.getCell('F15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('F14').value = Element.subject;
                worksheet.getCell('F15').value = Element.teacher_id;
            }
        });
        // FRIDAY 2
        worksheet.getCell('G14').font = { size: 9, bold: true };
        worksheet.getCell('G14').value = '';
        worksheet.getCell('G14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G15').font = { size: 10 };
        worksheet.getCell('G15').value = '';
        worksheet.getCell('G15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('G14').value = Element.subject;
                worksheet.getCell('G15').value = Element.teacher_id;
            }
        });

        //ROW 3
        worksheet.mergeCells('B16:B17');
        worksheet.getCell('B17').font = { size: 8 };
        worksheet.getCell('B17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(16).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(17).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B17').value = this.timeSet.thirth;
        // MONDAY 3
        worksheet.getCell('C16').font = { size: 9, bold: true };
        worksheet.getCell('C16').value = '';
        worksheet.getCell('C16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C17').font = { size: 10 };
        worksheet.getCell('C17').value = '';
        worksheet.getCell('C17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('C16').value = Element.subject;
                worksheet.getCell('C17').value = Element.teacher_id;
            }
        });
        // TUESDAY 3
        worksheet.getCell('D16').font = { size: 9, bold: true };
        worksheet.getCell('D16').value = '';
        worksheet.getCell('D16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D17').font = { size: 10 };
        worksheet.getCell('D17').value = '';
        worksheet.getCell('D17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('D16').value = Element.subject;
                worksheet.getCell('D17').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 3
        worksheet.getCell('E16').font = { size: 9, bold: true };
        worksheet.getCell('E16').value = '';
        worksheet.getCell('E16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E17').font = { size: 10 };
        worksheet.getCell('E17').value = '';
        worksheet.getCell('E17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('E16').value = Element.subject;
                worksheet.getCell('E17').value = Element.teacher_id;
            }
        });
        // THURSDAY 3
        worksheet.getCell('F16').font = { size: 9, bold: true };
        worksheet.getCell('F16').value = '';
        worksheet.getCell('F16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F17').font = { size: 10 };
        worksheet.getCell('F17').value = '';
        worksheet.getCell('F17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('F16').value = Element.subject;
                worksheet.getCell('F17').value = Element.teacher_id;
            }
        });
        // FRIDAY 3
        worksheet.getCell('G16').font = { size: 9, bold: true };
        worksheet.getCell('G16').value = '';
        worksheet.getCell('G16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G17').font = { size: 10 };
        worksheet.getCell('G17').value = '';
        worksheet.getCell('G17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('G16').value = Element.subject;
                worksheet.getCell('G17').value = Element.teacher_id;
            }
        });

        //ROW 4
        worksheet.mergeCells('B18:B19');
        worksheet.getCell('B19').font = { size: 8 };
        worksheet.getCell('B19').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(18).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(19).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B19').value = this.timeSet.fourth;
        // MONDAY 4
        worksheet.getCell('C18').font = { size: 9, bold: true };
        worksheet.getCell('C18').value = '';
        worksheet.getCell('C18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C19').font = { size: 10 };
        worksheet.getCell('C19').value = '';
        worksheet.getCell('C19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('C18').value = Element.subject;
                worksheet.getCell('C19').value = Element.teacher_id;
            }
        });
        // TUESDAY 4
        worksheet.getCell('D18').font = { size: 9, bold: true };
        worksheet.getCell('D18').value = '';
        worksheet.getCell('D18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D19').font = { size: 10 };
        worksheet.getCell('D19').value = '';
        worksheet.getCell('D19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('D18').value = Element.subject;
                worksheet.getCell('D19').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 4
        worksheet.getCell('E18').font = { size: 9, bold: true };
        worksheet.getCell('E18').value = '';
        worksheet.getCell('E18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E19').font = { size: 10 };
        worksheet.getCell('E19').value = '';
        worksheet.getCell('E19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('E18').value = Element.subject;
                worksheet.getCell('E19').value = Element.teacher_id;
            }
        });
        // THURSDAY 4
        worksheet.getCell('F18').font = { size: 9, bold: true };
        worksheet.getCell('F18').value = '';
        worksheet.getCell('F18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F19').font = { size: 10 };
        worksheet.getCell('F19').value = '';
        worksheet.getCell('F19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('F18').value = Element.subject;
                worksheet.getCell('F19').value = Element.teacher_id;
            }
        });
        // FRIDAY 4
        worksheet.getCell('G18').font = { size: 9, bold: true };
        worksheet.getCell('G18').value = '';
        worksheet.getCell('G18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G19').font = { size: 10 };
        worksheet.getCell('G19').value = '';
        worksheet.getCell('G19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('G18').value = Element.subject;
                worksheet.getCell('G19').value = Element.teacher_id;
            }
        });

        // ROW RECESO
        worksheet.getCell('B20').font = { size: 8 };
        worksheet.getCell('B20').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.mergeCells('C20:G20');
        worksheet.getCell('G20').font = { size: 9 };
        worksheet.getCell('G20').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(20).alignment = { horizontal: 'center' };
        worksheet.getCell('B20').value = this.timeSet.breaktime;
        worksheet.getCell('G20').value = 'RECESO';

        //ROW 5
        worksheet.mergeCells('B21:B22');
        worksheet.getCell('B22').font = { size: 8 };
        worksheet.getCell('B22').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(21).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(22).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B22').value = this.timeSet.fifth;
        // MONDAY 5
        worksheet.getCell('C21').font = { size: 9, bold: true };
        worksheet.getCell('C21').value = '';
        worksheet.getCell('C21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C22').font = { size: 10 };
        worksheet.getCell('C22').value = '';
        worksheet.getCell('C22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('C21').value = Element.subject;
                worksheet.getCell('C22').value = Element.teacher_id;
            }
        });
        // TUESDAY 5
        worksheet.getCell('D21').font = { size: 9, bold: true };
        worksheet.getCell('D21').value = '';
        worksheet.getCell('D21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D22').font = { size: 10 };
        worksheet.getCell('D22').value = '';
        worksheet.getCell('D22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('D21').value = Element.subject;
                worksheet.getCell('D22').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 5
        worksheet.getCell('E21').font = { size: 9, bold: true };
        worksheet.getCell('E21').value = '';
        worksheet.getCell('E21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E22').font = { size: 10 };
        worksheet.getCell('E22').value = '';
        worksheet.getCell('E22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('E21').value = Element.subject;
                worksheet.getCell('E22').value = Element.teacher_id;
            }
        });
        // THURSDAY 5
        worksheet.getCell('F21').font = { size: 9, bold: true };
        worksheet.getCell('F21').value = '';
        worksheet.getCell('F21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F22').font = { size: 10 };
        worksheet.getCell('F22').value = '';
        worksheet.getCell('F22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('F21').value = Element.subject;
                worksheet.getCell('F22').value = Element.teacher_id;
            }
        });
        // FRIDAY 5
        worksheet.getCell('G21').font = { size: 9, bold: true };
        worksheet.getCell('G21').value = '';
        worksheet.getCell('G21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G22').font = { size: 10 };
        worksheet.getCell('G22').value = '';
        worksheet.getCell('G22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('G21').value = Element.subject;
                worksheet.getCell('G22').value = Element.teacher_id;
            }
        });

        //ROW 6
        worksheet.mergeCells('B23:B24');
        worksheet.getCell('B24').font = { size: 8 };
        worksheet.getCell('B24').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(23).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(24).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B24').value = this.timeSet.sixth;
        // MONDAY 6
        worksheet.getCell('C23').font = { size: 9, bold: true };
        worksheet.getCell('C23').value = '';
        worksheet.getCell('C23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C24').font = { size: 10 };
        worksheet.getCell('C24').value = '';
        worksheet.getCell('C24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('C23').value = Element.subject;
                worksheet.getCell('C24').value = Element.teacher_id;
            }
        });
        // TUESDAY 6
        worksheet.getCell('D23').font = { size: 9, bold: true };
        worksheet.getCell('D23').value = '';
        worksheet.getCell('D23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D24').font = { size: 10 };
        worksheet.getCell('D24').value = '';
        worksheet.getCell('D24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('D23').value = Element.subject;
                worksheet.getCell('D24').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 6
        worksheet.getCell('E23').font = { size: 9, bold: true };
        worksheet.getCell('E23').value = '';
        worksheet.getCell('E23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E24').font = { size: 10 };
        worksheet.getCell('E24').value = '';
        worksheet.getCell('E24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('E23').value = Element.subject;
                worksheet.getCell('E24').value = Element.teacher_id;
            }
        });
        // THURSDAY 6
        worksheet.getCell('F23').font = { size: 9, bold: true };
        worksheet.getCell('F23').value = '';
        worksheet.getCell('F23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F24').font = { size: 10 };
        worksheet.getCell('F24').value = '';
        worksheet.getCell('F24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('F23').value = Element.subject;
                worksheet.getCell('F24').value = Element.teacher_id;
            }
        });
        // FRIDAY 6
        worksheet.getCell('G23').font = { size: 9, bold: true };
        worksheet.getCell('G23').value = '';
        worksheet.getCell('G23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G24').font = { size: 10 };
        worksheet.getCell('G24').value = '';
        worksheet.getCell('G24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('G23').value = Element.subject;
                worksheet.getCell('G24').value = Element.teacher_id;
            }
        });

        //ROW 7
        worksheet.mergeCells('B25:B26');
        worksheet.getCell('B26').font = { size: 8 };
        worksheet.getCell('B26').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(25).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(26).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B26').value = this.timeSet.seventh;
        // MONDAY 7
        worksheet.getCell('C25').font = { size: 9, bold: true };
        worksheet.getCell('C25').value = '';
        worksheet.getCell('C25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C26').font = { size: 10 };
        worksheet.getCell('C26').value = '';
        worksheet.getCell('C26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('C25').value = Element.subject;
                worksheet.getCell('C26').value = Element.teacher_id;
            }
        });
        // TUESDAY 7
        worksheet.getCell('D25').font = { size: 9, bold: true };
        worksheet.getCell('D25').value = '';
        worksheet.getCell('D25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D26').font = { size: 10 };
        worksheet.getCell('D26').value = '';
        worksheet.getCell('D26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('D25').value = Element.subject;
                worksheet.getCell('D26').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 7
        worksheet.getCell('E25').font = { size: 9, bold: true };
        worksheet.getCell('E25').value = '';
        worksheet.getCell('E25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E26').font = { size: 10 };
        worksheet.getCell('E26').value = '';
        worksheet.getCell('E26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('E25').value = Element.subject;
                worksheet.getCell('E26').value = Element.teacher_id;
            }
        });
        // THURSDAY 7
        worksheet.getCell('F25').font = { size: 9, bold: true };
        worksheet.getCell('F25').value = '';
        worksheet.getCell('F25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F26').font = { size: 10 };
        worksheet.getCell('F26').value = '';
        worksheet.getCell('F26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('F25').value = Element.subject;
                worksheet.getCell('F26').value = Element.teacher_id;
            }
        });
        // FRIDAY 7
        worksheet.getCell('G25').font = { size: 9, bold: true };
        worksheet.getCell('G25').value = '';
        worksheet.getCell('G25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G26').font = { size: 10 };
        worksheet.getCell('G26').value = '';
        worksheet.getCell('G26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('G25').value = Element.subject;
                worksheet.getCell('G26').value = Element.teacher_id;
            }
        });

        //ROW 8
        worksheet.mergeCells('B27:B28');
        worksheet.getCell('B28').font = { size: 8 };
        worksheet.getCell('B28').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(27).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(28).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('B28').value = this.timeSet.eighth;
        // MONDAY 8
        worksheet.getCell('C27').font = { size: 9, bold: true };
        worksheet.getCell('C27').value = '';
        worksheet.getCell('C27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C28').font = { size: 10 };
        worksheet.getCell('C28').value = '';
        worksheet.getCell('C28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('C27').value = Element.subject;
                worksheet.getCell('C28').value = Element.teacher_id;
            }
        });
        // TUESDAY 8
        worksheet.getCell('D27').font = { size: 9, bold: true };
        worksheet.getCell('D27').value = '';
        worksheet.getCell('D27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D28').font = { size: 10 };
        worksheet.getCell('D28').value = '';
        worksheet.getCell('D28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('D27').value = Element.subject;
                worksheet.getCell('D28').value = Element.teacher_id;
            }
        });
        // MIERCOLES 8
        worksheet.getCell('E27').font = { size: 9, bold: true };
        worksheet.getCell('E27').value = '';
        worksheet.getCell('E27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E28').font = { size: 10 };
        worksheet.getCell('E28').value = '';
        worksheet.getCell('E28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('E27').value = Element.subject;
                worksheet.getCell('E28').value = Element.teacher_id;
            }
        });
        // THURSDAY 8
        worksheet.getCell('F27').font = { size: 9, bold: true };
        worksheet.getCell('F27').value = '';
        worksheet.getCell('F27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F28').font = { size: 10 };
        worksheet.getCell('F28').value = '';
        worksheet.getCell('F28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('F27').value = Element.subject;
                worksheet.getCell('F28').value = Element.teacher_id;
            }
        });
        // FRIDAY 8
        worksheet.getCell('G27').font = { size: 9, bold: true };
        worksheet.getCell('G27').value = '';
        worksheet.getCell('G27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G28').font = { size: 10 };
        worksheet.getCell('G28').value = '';
        worksheet.getCell('G28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('G27').value = Element.subject;
                worksheet.getCell('G28').value = Element.teacher_id;
            }
        });
    }

    setSecondTable(worksheet, group) {
        //ROW 1
        worksheet.mergeCells('I12:I13');
        worksheet.getCell('I13').font = { size: 8 };
        worksheet.getCell('I13').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(12).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(13).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I13').value = this.timeSet.first;
        // MONDAY 1
        worksheet.getCell('J12').font = { size: 9, bold: true };
        worksheet.getCell('J12').value = '';
        worksheet.getCell('J12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J13').font = { size: 10 };
        worksheet.getCell('J13').value = '';
        worksheet.getCell('J13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('J12').value = Element.subject;
                worksheet.getCell('J13').value = Element.teacher_id;
            }
        });
        // TUESDAY 1
        worksheet.getCell('K12').font = { size: 9, bold: true };
        worksheet.getCell('K12').value = '';
        worksheet.getCell('K12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K13').font = { size: 10 };
        worksheet.getCell('K13').value = '';
        worksheet.getCell('K13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('K12').value = Element.subject;
                worksheet.getCell('K13').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 1
        worksheet.getCell('L12').font = { size: 9, bold: true };
        worksheet.getCell('L12').value = '';
        worksheet.getCell('L12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L13').font = { size: 10 };
        worksheet.getCell('L13').value = '';
        worksheet.getCell('L13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('L12').value = Element.subject;
                worksheet.getCell('L13').value = Element.teacher_id;
            }
        });
        // THURSDAY 1
        worksheet.getCell('M12').font = { size: 9, bold: true };
        worksheet.getCell('M12').value = '';
        worksheet.getCell('M12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M13').font = { size: 10 };
        worksheet.getCell('M13').value = '';
        worksheet.getCell('M13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('M12').value = Element.subject;
                worksheet.getCell('M13').value = Element.teacher_id;
            }
        });
        // FRIDAY 1
        worksheet.getCell('N12').font = { size: 9, bold: true };
        worksheet.getCell('N12').value = '';
        worksheet.getCell('N12').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N13').font = { size: 10 };
        worksheet.getCell('N13').value = '';
        worksheet.getCell('N13').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FIRST') {
                worksheet.getCell('N12').value = Element.subject;
                worksheet.getCell('N13').value = Element.teacher_id;
            }
        });

        //ROW 2
        worksheet.mergeCells('I14:I15');
        worksheet.getCell('I15').font = { size: 8 };
        worksheet.getCell('I15').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(14).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(15).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I15').value = this.timeSet.second;
        // MONDAY 2
        worksheet.getCell('J14').font = { size: 9, bold: true };
        worksheet.getCell('J14').value = '';
        worksheet.getCell('J14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J15').font = { size: 10 };
        worksheet.getCell('J15').value = '';
        worksheet.getCell('J15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('J14').value = Element.subject;
                worksheet.getCell('J15').value = Element.teacher_id;
            }
        });
        // TUESDAY 2
        worksheet.getCell('K14').font = { size: 9, bold: true };
        worksheet.getCell('K14').value = '';
        worksheet.getCell('K14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K15').font = { size: 10 };
        worksheet.getCell('K15').value = '';
        worksheet.getCell('K15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('K14').value = Element.subject;
                worksheet.getCell('K15').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 2
        worksheet.getCell('L14').font = { size: 9, bold: true };
        worksheet.getCell('L14').value = '';
        worksheet.getCell('L14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L15').font = { size: 10 };
        worksheet.getCell('L15').value = '';
        worksheet.getCell('L15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('L14').value = Element.subject;
                worksheet.getCell('L15').value = Element.teacher_id;
            }
        });
        // THURSDAY 2
        worksheet.getCell('M14').font = { size: 9, bold: true };
        worksheet.getCell('M14').value = '';
        worksheet.getCell('M14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M15').font = { size: 10 };
        worksheet.getCell('M15').value = '';
        worksheet.getCell('M15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('M14').value = Element.subject;
                worksheet.getCell('M15').value = Element.teacher_id;
            }
        });
        // FRIDAY 2
        worksheet.getCell('N14').font = { size: 9, bold: true };
        worksheet.getCell('N14').value = '';
        worksheet.getCell('N14').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N15').font = { size: 10 };
        worksheet.getCell('N15').value = '';
        worksheet.getCell('N15').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SECOND') {
                worksheet.getCell('N14').value = Element.subject;
                worksheet.getCell('N15').value = Element.teacher_id;
            }
        });

        //ROW 3
        worksheet.mergeCells('I16:I17');
        worksheet.getCell('I17').font = { size: 8 };
        worksheet.getCell('I17').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(16).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(17).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I17').value = this.timeSet.thirth;
        // MONDAY 3
        worksheet.getCell('J16').font = { size: 9, bold: true };
        worksheet.getCell('J16').value = '';
        worksheet.getCell('J16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J17').font = { size: 10 };
        worksheet.getCell('J17').value = '';
        worksheet.getCell('J17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('J16').value = Element.subject;
                worksheet.getCell('J17').value = Element.teacher_id;
            }
        });
        // TUESDAY 3
        worksheet.getCell('K16').font = { size: 9, bold: true };
        worksheet.getCell('K16').value = '';
        worksheet.getCell('K16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K17').font = { size: 10 };
        worksheet.getCell('K17').value = '';
        worksheet.getCell('K17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('K16').value = Element.subject;
                worksheet.getCell('K17').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 3
        worksheet.getCell('L16').font = { size: 9, bold: true };
        worksheet.getCell('L16').value = '';
        worksheet.getCell('L16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L17').font = { size: 10 };
        worksheet.getCell('L17').value = '';
        worksheet.getCell('L17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('L16').value = Element.subject;
                worksheet.getCell('L17').value = Element.teacher_id;
            }
        });
        // THURSDAY 3
        worksheet.getCell('M16').font = { size: 9, bold: true };
        worksheet.getCell('M16').value = '';
        worksheet.getCell('M16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M17').font = { size: 10 };
        worksheet.getCell('M17').value = '';
        worksheet.getCell('M17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('M16').value = Element.subject;
                worksheet.getCell('M17').value = Element.teacher_id;
            }
        });
        // FRIDAY 3
        worksheet.getCell('N16').font = { size: 9, bold: true };
        worksheet.getCell('N16').value = '';
        worksheet.getCell('N16').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N17').font = { size: 10 };
        worksheet.getCell('N17').value = '';
        worksheet.getCell('N17').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'THIRTH') {
                worksheet.getCell('N16').value = Element.subject;
                worksheet.getCell('N17').value = Element.teacher_id;
            }
        });

        //ROW 4
        worksheet.mergeCells('I18:I19');
        worksheet.getCell('I19').font = { size: 8 };
        worksheet.getCell('I19').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(18).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(19).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I19').value = this.timeSet.fourth;
        // MONDAY 4
        worksheet.getCell('J18').font = { size: 9, bold: true };
        worksheet.getCell('J18').value = '';
        worksheet.getCell('J18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J19').font = { size: 10 };
        worksheet.getCell('J19').value = '';
        worksheet.getCell('J19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('J18').value = Element.subject;
                worksheet.getCell('J19').value = Element.teacher_id;
            }
        });
        // TUESDAY 4
        worksheet.getCell('K18').font = { size: 9, bold: true };
        worksheet.getCell('K18').value = '';
        worksheet.getCell('K18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K19').font = { size: 10 };
        worksheet.getCell('K19').value = '';
        worksheet.getCell('K19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('K18').value = Element.subject;
                worksheet.getCell('K19').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 4
        worksheet.getCell('L18').font = { size: 9, bold: true };
        worksheet.getCell('L18').value = '';
        worksheet.getCell('L18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L19').font = { size: 10 };
        worksheet.getCell('L19').value = '';
        worksheet.getCell('L19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('L18').value = Element.subject;
                worksheet.getCell('L19').value = Element.teacher_id;
            }
        });
        // THURSDAY 4
        worksheet.getCell('M18').font = { size: 9, bold: true };
        worksheet.getCell('M18').value = '';
        worksheet.getCell('M18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M19').font = { size: 10 };
        worksheet.getCell('M19').value = '';
        worksheet.getCell('M19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('M18').value = Element.subject;
                worksheet.getCell('M19').value = Element.teacher_id;
            }
        });
        // FRIDAY 4
        worksheet.getCell('N18').font = { size: 9, bold: true };
        worksheet.getCell('N18').value = '';
        worksheet.getCell('N18').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N19').font = { size: 10 };
        worksheet.getCell('N19').value = '';
        worksheet.getCell('N19').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FOURTH') {
                worksheet.getCell('N18').value = Element.subject;
                worksheet.getCell('N19').value = Element.teacher_id;
            }
        });

        // ROW RECESO
        worksheet.getCell('I20').font = { size: 8 };
        worksheet.getCell('I20').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.mergeCells('J20:N20');
        worksheet.getCell('N20').font = { size: 9 };
        worksheet.getCell('N20').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(20).alignment = { horizontal: 'center' };
        worksheet.getCell('I20').value = this.timeSet.breaktime;
        worksheet.getCell('N20').value = 'RECESO';

        //ROW 5
        worksheet.mergeCells('I21:I22');
        worksheet.getCell('I22').font = { size: 8 };
        worksheet.getCell('I22').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(21).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(22).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I22').value = this.timeSet.fifth;
        // MONDAY 5
        worksheet.getCell('J21').font = { size: 9, bold: true };
        worksheet.getCell('J21').value = '';
        worksheet.getCell('J21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J22').font = { size: 10 };
        worksheet.getCell('J22').value = '';
        worksheet.getCell('J22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('J21').value = Element.subject;
                worksheet.getCell('J22').value = Element.teacher_id;
            }
        });
        // TUESDAY 5
        worksheet.getCell('K21').font = { size: 9, bold: true };
        worksheet.getCell('K21').value = '';
        worksheet.getCell('K21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K22').font = { size: 10 };
        worksheet.getCell('K22').value = '';
        worksheet.getCell('K22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('K21').value = Element.subject;
                worksheet.getCell('K22').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 5
        worksheet.getCell('L21').font = { size: 9, bold: true };
        worksheet.getCell('L21').value = '';
        worksheet.getCell('L21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L22').font = { size: 10 };
        worksheet.getCell('L22').value = '';
        worksheet.getCell('L22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('L21').value = Element.subject;
                worksheet.getCell('L22').value = Element.teacher_id;
            }
        });
        // THURSDAY 5
        worksheet.getCell('M21').font = { size: 9, bold: true };
        worksheet.getCell('M21').value = '';
        worksheet.getCell('M21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M22').font = { size: 10 };
        worksheet.getCell('M22').value = '';
        worksheet.getCell('M22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('M21').value = Element.subject;
                worksheet.getCell('M22').value = Element.teacher_id;
            }
        });
        // FRIDAY 5
        worksheet.getCell('N21').font = { size: 9, bold: true };
        worksheet.getCell('N21').value = '';
        worksheet.getCell('N21').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N22').font = { size: 10 };
        worksheet.getCell('N22').value = '';
        worksheet.getCell('N22').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'FIFTH') {
                worksheet.getCell('N21').value = Element.subject;
                worksheet.getCell('N22').value = Element.teacher_id;
            }
        });

        //ROW 6
        worksheet.mergeCells('I23:I24');
        worksheet.getCell('I24').font = { size: 8 };
        worksheet.getCell('I24').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(23).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(24).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I24').value = this.timeSet.sixth;
        // MONDAY 6
        worksheet.getCell('J23').font = { size: 9, bold: true };
        worksheet.getCell('J23').value = '';
        worksheet.getCell('J23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J24').font = { size: 10 };
        worksheet.getCell('J24').value = '';
        worksheet.getCell('J24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('J23').value = Element.subject;
                worksheet.getCell('J24').value = Element.teacher_id;
            }
        });
        // TUESDAY 6
        worksheet.getCell('K23').font = { size: 9, bold: true };
        worksheet.getCell('K23').value = '';
        worksheet.getCell('K23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K24').font = { size: 10 };
        worksheet.getCell('K24').value = '';
        worksheet.getCell('K24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('K23').value = Element.subject;
                worksheet.getCell('K24').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 6
        worksheet.getCell('L23').font = { size: 9, bold: true };
        worksheet.getCell('L23').value = '';
        worksheet.getCell('L23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L24').font = { size: 10 };
        worksheet.getCell('L24').value = '';
        worksheet.getCell('L24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('L23').value = Element.subject;
                worksheet.getCell('L24').value = Element.teacher_id;
            }
        });
        // THURSDAY 6
        worksheet.getCell('M23').font = { size: 9, bold: true };
        worksheet.getCell('M23').value = '';
        worksheet.getCell('M23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M24').font = { size: 10 };
        worksheet.getCell('M24').value = '';
        worksheet.getCell('M24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('M23').value = Element.subject;
                worksheet.getCell('M24').value = Element.teacher_id;
            }
        });
        // FRIDAY 6
        worksheet.getCell('N23').font = { size: 9, bold: true };
        worksheet.getCell('N23').value = '';
        worksheet.getCell('N23').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N24').font = { size: 10 };
        worksheet.getCell('N24').value = '';
        worksheet.getCell('N24').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SIXTH') {
                worksheet.getCell('N23').value = Element.subject;
                worksheet.getCell('N24').value = Element.teacher_id;
            }
        });

        //ROW 7
        worksheet.mergeCells('I25:I26');
        worksheet.getCell('I26').font = { size: 8 };
        worksheet.getCell('I26').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(25).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(26).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I26').value = this.timeSet.seventh;
        // MONDAY 7
        worksheet.getCell('J25').font = { size: 9, bold: true };
        worksheet.getCell('J25').value = '';
        worksheet.getCell('J25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J26').font = { size: 10 };
        worksheet.getCell('J26').value = '';
        worksheet.getCell('J26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('J25').value = Element.subject;
                worksheet.getCell('J26').value = Element.teacher_id;
            }
        });
        // TUESDAY 7
        worksheet.getCell('K25').font = { size: 9, bold: true };
        worksheet.getCell('K25').value = '';
        worksheet.getCell('K25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K26').font = { size: 10 };
        worksheet.getCell('K26').value = '';
        worksheet.getCell('K26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('K25').value = Element.subject;
                worksheet.getCell('K26').value = Element.teacher_id;
            }
        });
        // WEDNESDAY 7
        worksheet.getCell('L25').font = { size: 9, bold: true };
        worksheet.getCell('L25').value = '';
        worksheet.getCell('L25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L26').font = { size: 10 };
        worksheet.getCell('L26').value = '';
        worksheet.getCell('L26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('L25').value = Element.subject;
                worksheet.getCell('L26').value = Element.teacher_id;
            }
        });
        // THURSDAY 7
        worksheet.getCell('M25').font = { size: 9, bold: true };
        worksheet.getCell('M25').value = '';
        worksheet.getCell('M25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M26').font = { size: 10 };
        worksheet.getCell('M26').value = '';
        worksheet.getCell('M26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('M25').value = Element.subject;
                worksheet.getCell('M26').value = Element.teacher_id;
            }
        });
        // FRIDAY 7
        worksheet.getCell('N25').font = { size: 9, bold: true };
        worksheet.getCell('N25').value = '';
        worksheet.getCell('N25').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N26').font = { size: 10 };
        worksheet.getCell('N26').value = '';
        worksheet.getCell('N26').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'SEVENTH') {
                worksheet.getCell('N25').value = Element.subject;
                worksheet.getCell('N26').value = Element.teacher_id;
            }
        });

        //ROW 8
        worksheet.mergeCells('I27:I28');
        worksheet.getCell('I28').font = { size: 8 };
        worksheet.getCell('I28').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getRow(27).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getRow(28).alignment = { vertical: 'middle', wrapText: true, horizontal: 'center' };
        worksheet.getCell('I28').value = this.timeSet.eighth;
        // MONDAY 8
        worksheet.getCell('J27').font = { size: 9, bold: true };
        worksheet.getCell('J27').value = '';
        worksheet.getCell('J27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J28').font = { size: 10 };
        worksheet.getCell('J28').value = '';
        worksheet.getCell('J28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.monday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('J27').value = Element.subject;
                worksheet.getCell('J28').value = Element.teacher_id;
            }
        });
        // TUESDAY 8
        worksheet.getCell('K27').font = { size: 9, bold: true };
        worksheet.getCell('K27').value = '';
        worksheet.getCell('K27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K28').font = { size: 10 };
        worksheet.getCell('K28').value = '';
        worksheet.getCell('K28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.tuesday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('K27').value = Element.subject;
                worksheet.getCell('K28').value = Element.teacher_id;
            }
        });
        // MIERCOLES 8
        worksheet.getCell('L27').font = { size: 9, bold: true };
        worksheet.getCell('L27').value = '';
        worksheet.getCell('L27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L28').font = { size: 10 };
        worksheet.getCell('L28').value = '';
        worksheet.getCell('L28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.wednesday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('L27').value = Element.subject;
                worksheet.getCell('L28').value = Element.teacher_id;
            }
        });
        // THURSDAY 8
        worksheet.getCell('M27').font = { size: 9, bold: true };
        worksheet.getCell('M27').value = '';
        worksheet.getCell('M27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M28').font = { size: 10 };
        worksheet.getCell('M28').value = '';
        worksheet.getCell('M28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.thursday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('M27').value = Element.subject;
                worksheet.getCell('M28').value = Element.teacher_id;
            }
        });
        // FRIDAY 8
        worksheet.getCell('N27').font = { size: 9, bold: true };
        worksheet.getCell('N27').value = '';
        worksheet.getCell('N27').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N28').font = { size: 10 };
        worksheet.getCell('N28').value = '';
        worksheet.getCell('N28').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        group.friday.forEach((Element) => {
            if (Element.hour == 'EIGHTH') {
                worksheet.getCell('N27').value = Element.subject;
                worksheet.getCell('N28').value = Element.teacher_id;
            }
        });
    }
}