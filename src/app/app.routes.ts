import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AttendanceCategoryComponent } from './pages/attendance-category/attendance-category.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { SubjectSelectComponent } from './pages/subject-select/subject-select.component';
import { SubjectListComponent } from './pages/subject-list/subject-list.component';
import { SubjectFormComponent } from './pages/subject-form/subject-form.component';
import { MeetingListComponent } from './pages/meeting-list/meeting-list.component';
import { MeetingFormComponent } from './pages/meeting-form/meeting-form.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { StudentWiseSubjectListComponent } from './pages/student-wise-subject-list/student-wise-subject-list.component';
import { AdminListComponent } from './pages/admin-list/admin-list.component';
import { AdminFormComponent } from './pages/admin-form/admin-form.component';
import { AttendanceReportComponent } from './pages/attendance-report/attendance-report.component';
import { authGuard } from './services/auth.guard';
import { AttendanceDetailsComponent } from './pages/attendance-details/attendance-details.component';
import { AttendanceDetailsFormComponent } from './pages/attendance-details-form/attendance-details-form.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'admin-list',
                component: AdminListComponent
            },
            {
                path: 'admin-list/add',
                component: AdminFormComponent
            },
            {
                path: 'admin-list/edit/:id',
                component: AdminFormComponent
            },
            {
                path: 'attendance-category',
                component: AttendanceCategoryComponent
            },
            {
                path: 'attendance-list/:subjectId',
                component: AttendanceComponent
            },
            {
                path: 'attendance-report/:subjectId',
                component: AttendanceReportComponent
            },
            {
                path: 'attendance-details',
                component: AttendanceDetailsComponent
            },
            {
                path: 'attendance-details/edit/:id',
                component: AttendanceDetailsFormComponent
            },
            {
                path: 'meeting',
                component: MeetingComponent
            },
            {
                path: 'student-list',
                component: StudentListComponent
            },
            {
                path: 'student-list/add',
                component: StudentFormComponent
            },
            {
                path: 'student-list/edit/:id',
                component: StudentFormComponent
            },
            {
                path: 'subject-list',
                component: SubjectListComponent
            },
            {
                path: 'subject-list/add',
                component: SubjectFormComponent
            },
            {
                path: 'subject-list/edit/:id',
                component: SubjectFormComponent
            },
            {
                path: 'subject-selection',
                component: StudentWiseSubjectListComponent
            },
            {
                path: 'subject-selection/add',
                component: SubjectSelectComponent
            },
            {
                path: 'subject-selection/edit/:id',
                component: SubjectSelectComponent
            },
            {
                path: 'meeting-list',
                component: MeetingListComponent
            },
            {
                path: 'meeting-list/add',
                component: MeetingFormComponent
            },
            {
                path: 'meeting-list/edit/:id',
                component: MeetingFormComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
];
