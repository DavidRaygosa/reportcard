import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
@Injectable({
	providedIn: 'root'
})
export class PushService {
	public url: string;
	constructor(private _http: HttpClient) {
		this.url = Global.url;
	}
	savePush = (data): Observable<any> => {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		let params = JSON.stringify(data);
		return this._http.post(this.url + 'save-push', {params}, { headers: headers });
	}
	getPush() {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'send-push', { headers: headers });
	}
}