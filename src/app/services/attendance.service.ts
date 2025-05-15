import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);

  private apiCall<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', body?: any): Observable<T> {
    return this.dataService.getPort().pipe(
      switchMap(port => {
        const url = `${port}/api/StudentAttendance${endpoint}`;
        return this.http.request<T>(method, url, { body });
      })
    );
  }

  addAttendance(model: any): Observable<void> {
    return this.apiCall<void>('', 'post', model);
  }

  getAttendance(id: any, subjectId: any = null, studentId: any = null, search: any = "", fromDate: any = null, toDate: any = null): Observable<any> {
    return this.apiCall<any>(`/SearchStudentAttendance`, 'post', {
      "id": id || null,
      "subjectId": subjectId || null,
      "studentId": studentId || null,
      "search": search || "",
      "fromDate": fromDate || null,
      "toDate": toDate || null
    });
  }

  getAttendanceDetails(id: any, subjectId: any = null, studentId: any = null, search: any = "", fromDate: any = null, toDate: any = null, session: any = "", batch: any = ""): Observable<any> {
    return this.apiCall<any>(`/SearchStudentAttendancewithDetail`, 'post', {
      "id": id || null,
      "subjectId": subjectId?.toString() || null,
      "studentId": studentId || null,
      "search": search || "",
      "fromDate": fromDate || null,
      "toDate": toDate || null,
      "sOthers1": session === "All" ? "" : session || "",
      "sOthers2": batch === "All" ? "" : batch || "",
      "sOthers3": ""
    });
  }

  updateAttendance(id: string | number, updateAttendanceRequest: any): Observable<any> {
    return this.apiCall<any>(`/EditStudentAttendance/${id}`, 'put', updateAttendanceRequest);
  }

  updateAttendanceDetails(id: string | number, updateAttendanceRequest: any): Observable<any> {
    return this.apiCall<any>(`/EditStudentAttendenceDetail/${id}`, 'put', updateAttendanceRequest);
  }

  deleteAttendance(id: string | number): Observable<any> {
    return this.apiCall<any>(`/DeleteStudentAttendance?id=${id}`, 'delete');
  }

  getSubjectWiseAttendanceReport(studentId: any = null, fromDate: any = null, toDate: any = null, search: any = "", session: any = "", batch: any = ""): Observable<any> {
    return this.apiCall<any>(`/SubjecttwiseAttendanceReport`, 'post', {
      "studentId": studentId || null,
      "search": search || "",
      "fromDate": fromDate || null,
      "toDate": toDate || null,
      "sOthers1": session === "All" ? "" : session || "",
      "sOthers2": batch === "All" ? "" : batch || "",
      "sOthers3": ""
    });
  }

  getStudentWiseAttendanceReport(subjectId: any = null, fromDate: any = null, toDate: any = null, search: any = "", session: any = "", batch: any = ""): Observable<any> {
    return this.apiCall<any>(`/StudentwiseAttendanceReport`, 'post', {
      "subjectId": subjectId || null,
      "search": search || "",
      "fromDate": fromDate || null,
      "toDate": toDate || null,
      "sOthers1": session === "All" ? "" : session || "",
      "sOthers2": batch === "All" ? "" : batch || "",
      "sOthers3": ""
    });
  }
}
