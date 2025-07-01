import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AttendanceCategoryComponent } from './pages/attendance-category/attendance-category.component';
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
import { AttendanceDetailsComponent } from './pages/attendance-details/attendance-details.component';
import { AttendanceDetailsFormComponent } from './pages/attendance-details-form/attendance-details-form.component';
import { AttendanceSubmitComponent } from './pages/attendance-submit/attendance-submit.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { teacherGuard } from './guards/teacher.guard';
import { stuffGuard } from './guards/stuff.guard';
import { StudentWiseSubjectReportComponent } from './pages/student-wise-subject-report/student-wise-subject-report.component';
import { SubjectWiseStudentReportComponent } from './pages/subject-wise-student-report/subject-wise-student-report.component';

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
                component: AdminListComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'admin-list/add',
                component: AdminFormComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'admin-list/edit/:id',
                component: AdminFormComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'attendance-category',
                component: AttendanceCategoryComponent,
                canActivate: [teacherGuard]
            },
            {
                path: 'attendance-submit/:subjectId',
                component: AttendanceSubmitComponent,
                canActivate: [teacherGuard]
            },
            {
                path: 'attendance-report/:subjectId',
                component: AttendanceReportComponent,
                canActivate: [teacherGuard]
            },
            {
                path: 'attendance-details',
                component: AttendanceDetailsComponent,
                canActivate: [teacherGuard]
            },
            {
                path: 'attendance-details/edit/:id',
                component: AttendanceDetailsFormComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'reports/student-wise-attendance',
                component: StudentWiseSubjectReportComponent,
                canActivate: [authGuard]
            },
            {
                path: 'reports/subject-wise-attendance',
                component: SubjectWiseStudentReportComponent,
                canActivate: [authGuard]
            },
            {
                path: 'meeting',
                component: MeetingComponent,
            },
            {
                path: 'student-list',
                component: StudentListComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'student-list/add',
                component: StudentFormComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'student-list/edit/:id',
                component: StudentFormComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-list',
                component: SubjectListComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-list/add',
                component: SubjectFormComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-list/edit/:id',
                component: SubjectFormComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-selection',
                component: StudentWiseSubjectListComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-selection/add',
                component: SubjectSelectComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'subject-selection/edit/:id',
                component: SubjectSelectComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'meeting-list',
                component: MeetingListComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'meeting-list/add',
                component: MeetingFormComponent,
                canActivate: [stuffGuard]
            },
            {
                path: 'meeting-list/edit/:id',
                component: MeetingFormComponent,
                canActivate: [stuffGuard]
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
];
