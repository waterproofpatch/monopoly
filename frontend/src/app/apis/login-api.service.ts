import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../services/base.service';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService extends BaseService {
  apiUrl = '/api/login';
  constructor(private http: HttpClient) {
    super();
  }

  loginHttp(email: string, password: string): Observable<any> {
    const data = {
      email: email,
      password: password,
    };

    return this.http.post(
      this.getUrlBase() + this.apiUrl,
      data,
      this.httpOptions
    );
  }
}
