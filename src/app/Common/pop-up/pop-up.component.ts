import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {

 
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure ';
  @Input() ButtonText = 'Confirm';
  @Input() show = false;  

  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete  = new EventEmitter<void>();

  onConfirm() {
    this.confirmDelete.emit ();
  }
  onCancel() {
    this.cancelDelete.emit();
  }
}
