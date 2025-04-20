import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule,CardComponent],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {
  //@Input() tableHeaders: string[] = [];
  //@Input() tableKeys: string[] = [];
  @Input() tableData: any[] = [];
  @Input() hiddenColumns: string[] = [];
  //@Output() edit = new EventEmitter<any>();
  //@Output() delete = new EventEmitter<any>();


  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && this.tableData.length > 0) {
      const allKeys = Object.keys(this.tableData[0]);
      this.displayedColumns = allKeys.filter(key => !this.hiddenColumns.includes(key));
    }
  }

  // onEdit(row: any): void {
  //   this.edit.emit(row);
  // }

  // onDelete(id: number): void {
  //   this.delete.emit(id);
  // }
}
