import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
@Injectable({
	providedIn: 'root'
})
export class LogosService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	updateLogo = (Logo: any): Observable<any> => {
		let params = JSON.stringify(Logo);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.put(this.url + 'update-logo/' + Logo._id, params, { headers: headers });
	}
	getLogos() {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'get-logos', { headers: headers });
	}
}