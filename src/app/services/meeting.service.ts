import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);

  private apiCall<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', body?: any): Observable<T> {
    return this.dataService.getPort().pipe(
      switchMap(port => {
        const url = `${port}/api/Meeting${endpoint}`;
        return this.http.request<T>(method, url, { body });
      })
    );
  }

  addMeeting(model: any): Observable<void> {
    return this.apiCall<void>('', 'post', model);
  }

  getMeeting(id: any, search: any, fromDate: any, toDate: any): Observable<any> {
    const searchParams = {
      "search": search || "",
      "id": id || "",
      "fromDate": fromDate || null,
      "toDate": toDate || fromDate || null
    };
    return this.apiCall<any>(`/Search`, 'post', searchParams);
  }

  updateMeeting(id: string | number, updateMeetingRequest: any): Observable<any> {
    return this.apiCall<any>(`/Edit/${id}`, 'put', updateMeetingRequest);
  }

  deleteMeeting(id: string | number): Observable<any> {
    return this.apiCall<any>(`/Delete?id=${id}`, 'delete');
  }
}
