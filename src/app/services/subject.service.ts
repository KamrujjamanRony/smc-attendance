import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);

  private apiCall<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', body?: any): Observable<T> {
    return this.dataService.getPort().pipe(
      switchMap(port => {
        const url = `${port}/api/SubjectName${endpoint}`;
        return this.http.request<T>(method, url, { body });
      })
    );
  }

  addSubject(model: any): Observable<void> {
    return this.apiCall<void>('', 'post', model);
  }

  getSubject(id: any, search: any): Observable<any> {
    return this.apiCall<any>(`/Search`, 'post', {
      "search": search || "",
      "id": id || null,
    });
  }

  updateSubject(id: string | number, updateSubjectRequest: any): Observable<any> {
    return this.apiCall<any>(`/Edit/${id}`, 'put', updateSubjectRequest);
  }

  deleteSubject(id: string | number): Observable<any> {
    return this.apiCall<any>(`/Delete?id=${id}`, 'delete');
  }
}
