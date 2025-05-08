/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    ;
    const tokendata = localStorage.getItem('data'); // Retrieve token from localStorage or another source
    const parsedata= tokendata? JSON.parse(tokendata) : null;
    const token = parsedata?.data;
    //const userId = localStorage.getItem('userId');
    return new HttpHeaders({
      Authorization: token ? `bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  POST<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, {headers : this.getAuthHeaders()});
  }

  GET<T>(url: string): Observable<T> {
    return this.http.get<T>(url,{headers : this.getAuthHeaders()});
  }

  PUT<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body,{headers : this.getAuthHeaders()});
  }
  DELETE<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: this.getAuthHeaders() });
  }

}

