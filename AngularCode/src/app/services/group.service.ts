import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
@Injectable({
	providedIn: 'root'
})
export class GroupService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	getGroupByID = (id: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-group/'+ id, { headers: headers });
	}
	addTeacher = (IDGroup:any, Teacher:any, Day:any):Observable<any> =>
	{
		let params = JSON.stringify(Teacher);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url+'add-teacher/'+IDGroup+'/'+Day, params, {headers: headers});
	}
	updateGroup = (group:any):Observable<any> =>
	{
		let params = JSON.stringify(group);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url+'update-group/'+group._id, params, {headers: headers});
	}
	getGroups() {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-groups', { headers: headers });
	}
}