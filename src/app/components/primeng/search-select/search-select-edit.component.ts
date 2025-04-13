import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-select-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  template: `
    <p-dropdown
      [options]="options"
      [(ngModel)]="internalSelected"
      (onChange)="onSelectionChange($event.value)"
      optionLabel="label"
      optionValue="id"
      [filter]="true"
      filterBy="label"
      [showClear]="true"
      placeholder="Select option"
      class="w-full"
      dropdownIcon="pi pi-chevron-down"
    >
    <!-- !bg-gray-600 !border !text-sm !rounded !focus:ring-blue-500 !focus:border-blue-500 block w-full p-0.5 border-gray-500 !placeholder-gray-100 !text-white  -->
      <ng-template pTemplate="selectedItem">
        {{ getSelectedLabel() || 'Select option' }}
      </ng-template>
    </p-dropdown>
  `,
})
export class SearchSelectEditComponent {
  @Input() options: any[] = [];
  @Input() selected: any;
  @Output() selectedChange = new EventEmitter<any>();

  internalSelected: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      this.internalSelected = changes['selected'].currentValue;
      this.cdr.detectChanges();
    }
  }

  onSelectionChange(id: any) {
    this.selectedChange.emit(id);
  }

  getSelectedLabel(): string {
    if (!this.internalSelected) return 'Select option';
    const option = this.options.find(opt => opt.id === this.internalSelected);
    // console.log(option)
    return option ? option.label : 'Select option';
  }

}
