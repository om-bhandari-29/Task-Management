import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone: true
})
export class CardsComponent {
  @Input() title!: string;
  @Input() text!: string;
}
