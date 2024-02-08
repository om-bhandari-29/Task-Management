import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true
})
export class ErrorComponent {
  @Input() error: string = "Error Occured";
  @Input() errorCode!: number;

}
