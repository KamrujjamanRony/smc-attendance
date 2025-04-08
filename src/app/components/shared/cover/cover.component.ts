import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cover',
  imports: [],
  templateUrl: './cover.component.html',
})
export class CoverComponent {
  readonly title = input<any>('');
  readonly sub1 = input<any>('');
  readonly sub2 = input<any>('');

}
