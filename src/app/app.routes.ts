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

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'attendance-category',
                component: AttendanceCategoryComponent
            },
            {
                path: 'subject-selection',
                component: SubjectSelectComponent
            },
            {
                path: 'attendance-list/:subjectId',
                component: AttendanceComponent
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
