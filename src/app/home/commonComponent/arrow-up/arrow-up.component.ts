import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-arrow-up',
  templateUrl: './arrow-up.component.html',
  styleUrls: ['./arrow-up.component.scss'],
  standalone: true
})
export class ArrowUpComponent {

  @Output() sortTaskChild = new EventEmitter<{title: string, sortBy: number}>();
  @Input() title!: string;

  public sort(oTitle: string, order: number){
    console.log("Up arroe clicked");
    const obj = {
      title: oTitle,
      sortBy: order
    }
    this.sortTaskChild.emit(obj);
  }
}
