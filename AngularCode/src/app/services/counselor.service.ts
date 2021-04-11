import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CounselorModel } from '../models/counselor.model';
@Injectable({
	providedIn: 'root'
})
export class CounselorService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	getCounselors() {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-counselor', { headers: headers });
	}
	getCounselorByID = (id: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-counselor/' + id, { headers: headers });
	}
	createCounselor = (counselor: CounselorModel): Observable<any> => {
		let params = JSON.stringify(counselor);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'create-counselor', params, { headers: headers });
	}
	getCounselorsRange(skip: number) {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-counselorsrangeadmin/' + skip, { headers: headers });
	}
	getCounselorByLastname = (lastname: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-counselorbylastname/' + lastname, { headers: headers });
	}
	updateCounselor = (Counselor: any): Observable<any> => {
		let params = JSON.stringify(Counselor);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url + 'update-counselor/' + Counselor._id, params, { headers: headers });
	}
	deleteCounselor = (id: any): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.delete(this.url + 'delete-counselor/' + id, { headers: headers });
	}
}