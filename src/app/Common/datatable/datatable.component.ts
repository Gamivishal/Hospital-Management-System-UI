import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {
  @Input() tableHeaders: string[] = [];
  @Input() tableKeys: string[] = [];
  @Input() tableData: any[] = [];
}
