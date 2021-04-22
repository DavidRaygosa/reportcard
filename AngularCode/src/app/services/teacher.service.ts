import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { TeacherModel } from '../models/teacher.model';
@Injectable({
	providedIn: 'root'
})
export class TeacherService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	createTeacher = (teacher: TeacherModel): Observable<any> => {
		let params = JSON.stringify(teacher);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'create-teacher', params, { headers: headers });
	}
	getTeachersRange(skip: number) {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-teachersrangeadmin/' + skip, { headers: headers });
	}
	getTeacherByID = (id: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-teacher/' + id, { headers: headers });
	}
	getTeacherByLastname = (lastname: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-teacherbylastname/' + lastname, { headers: headers });
	}
	getTeacherByTurn = (turn: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-teacherbyturn/' + turn, { headers: headers });
	}
	updateTeacher = (Teacher: any): Observable<any> => {
		let params = JSON.stringify(Teacher);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url + 'update-teacher/' + Teacher._id, params, { headers: headers });
	}
	deleteTeacher = (id: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.delete(this.url + 'delete-teacher/' + id, { headers: headers });
	}
	addGroup = (IDTeacher:any, Group:any):Observable<any> =>
	{
		let params = JSON.stringify(Group);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url+'add-group/'+IDTeacher, params, {headers: headers});
	}
	getTeachers() {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-teachers', { headers: headers });
	}
}