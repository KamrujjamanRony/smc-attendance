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
      class="w-full"
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
