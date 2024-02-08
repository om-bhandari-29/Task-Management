import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-arrow-down',
  templateUrl: './arrow-down.component.html',
  styleUrls: ['./arrow-down.component.scss'],
  standalone: true
})
export class ArrowDownComponent {
  
  @Output() sortTaskChild = new EventEmitter<{title: string, sortBy: number}>();
  @Input() title !: string;

  public sort(title: string, orderBy: number){
    const obj = {
      title: title,
      sortBy: orderBy
    }
    this.sortTaskChild.emit(obj);
  }
}
