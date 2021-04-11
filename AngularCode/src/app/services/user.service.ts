import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { User } from '../models/user.model'
@Injectable({
	providedIn: 'root'
})
export class UserService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	checkLogin = (user: String): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-user/' + user, { headers: headers });
	}
}