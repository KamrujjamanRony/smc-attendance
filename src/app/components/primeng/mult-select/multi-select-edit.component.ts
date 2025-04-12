import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multi-select-edit',
  standalone: true,
  imports: [FormsModule, MultiSelectModule],
  template: `
      <p-multiselect 
        [options]="options" 
        [(ngModel)]="selectedOptions" 
        (onChange)="setSubject($event.value)"
        optionValue="id" 
        optionLabel="label" 
        placeholder="Select Options" 
        [maxSelectedLabels]="20" 
        styleClass="!bg-gray-600 !border !text-sm !rounded !focus:ring-blue-500 !focus:border-blue-500 block w-full p-0.5 border-gray-500 !placeholder-gray-100 !text-white">
      </p-multiselect>
  `,
})
export class MultiSelectEditComponent {
  @Input() options: any[] = [];  // Receive options dynamically from parent
  @Input() selectedOptions: any[] = [];
  @Output() subjectChange = new EventEmitter<any>();

  setSubject(data: any[]) {
    this.subjectChange.emit(data);
  }
}