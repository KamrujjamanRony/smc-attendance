import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);

  private apiCall<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', body?: any): Observable<T> {
    return this.dataService.getPort().pipe(
      switchMap(port => {
        const url = `${port}/api/Login${endpoint}`;
        return this.http.request<T>(method, url, { body });
      })
    );
  }

  addLogin(model: any): Observable<void> {
    return this.apiCall<void>('', 'post', model);
  }

  login(query: any): Observable<any> {
    return this.apiCall<any>(`/Pass`, 'post', query);
  }

  getLogin(id: any, userName: any): Observable<any> {
    return this.apiCall<any>(`/Search`, 'post', {
      "userName": userName || "",
      "id": id || "",
    });
  }

  updateLogin(id: string | number, updateLoginRequest: any): Observable<any> {
    return this.apiCall<any>(`/Edit/${id}`, 'put', updateLoginRequest);
  }

  deleteLogin(id: string | number): Observable<any> {
    return this.apiCall<any>(`/Delete?id=${id}`, 'delete');
  }
}
