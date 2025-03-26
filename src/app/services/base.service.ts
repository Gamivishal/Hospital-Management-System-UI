import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private http: HttpClient) {}

  POST<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  GET<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  PUT<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  DELETE<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
