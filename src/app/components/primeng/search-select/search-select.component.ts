import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  template: `
    <p-dropdown
      [options]="options"
      [(ngModel)]="selected"
      (onChange)="onSelectionChange(selected)"
      optionLabel="label"
      [filter]="true"
      filterBy="label"
      [showClear]="true"
      placeholder="Select option"
      class="!bg-gray-600 !border !text-sm !rounded !focus:ring-blue-500 !focus:border-blue-500 block w-full p-0.5 border-gray-500 !placeholder-gray-100 !text-white"
      dropdownIcon="pi pi-chevron-down"
    >
      <!-- Selected item template -->
      <ng-template let-selectedOption pTemplate="selectedItem">
      {{ selectedOption?.label }}
      </ng-template>

      <!-- Dropdown list template -->
      <ng-template let-option pTemplate="item">
        {{ option?.label }}
      </ng-template>
    </p-dropdown>
  `,
})
export class SearchSelectComponent {
  @Input() options: any[] = [];
  selected: any;
  @Output() selectedChange = new EventEmitter<any>();

  onSelectionChange(value: any) {
    this.selectedChange.emit(value);
  }

}
