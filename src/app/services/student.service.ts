import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);

  private apiCall<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', body?: any): Observable<T> {
    return this.dataService.getPort().pipe(
      switchMap(port => {
        const url = `${port}/api/StudentInf${endpoint}`;
        return this.http.request<T>(method, url, { body });
      })
    );
  }

  addStudent(model: any): Observable<void> {
    return this.apiCall<void>('', 'post', model);
  }

  getStudent(id: any, search: any): Observable<any> {
    return this.apiCall<any>(`/Search`, 'post', {
      "search": search || "",
      "id": id || null,
    });
  }

  updateStudent(id: string | number, updateStudentRequest: any): Observable<any> {
    return this.apiCall<any>(`/Edit/${id}`, 'put', updateStudentRequest);
  }

  deleteStudent(id: string | number): Observable<any> {
    return this.apiCall<any>(`/Delete?id=${id}`, 'delete');
  }
}
