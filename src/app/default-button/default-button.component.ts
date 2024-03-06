import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss']
})
export class DefaultButtonComponent {

	@Input() buttonText: string = '';
	@Input() className: string = '';
	@Output() btnClick = new EventEmitter();
	@Input() isDisabled = false;

	constructor() {}

	onClick() {
		this.btnClick.emit();
	}


}

