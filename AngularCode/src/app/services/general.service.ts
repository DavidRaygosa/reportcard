import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
@Injectable({
	providedIn: 'root'
})
export class GeneralService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	getGeneral = (): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-general', { headers: headers });
	}
	updateGeneral = (settings: any): Observable<any> => {
		let params = JSON.stringify(settings);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url + 'update-general/' + settings._id, params, { headers: headers });
	}
}