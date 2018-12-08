import {Component, Input, OnDestroy, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


const RADIO_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioComponent),
  multi: true,
}; 


@Component({
  selector: 'app-radio',
  providers: [RADIO_CONTROL_ACCESSOR],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, ControlValueAccessor {

  private onTouch: Function;
  private onModelChange: Function;

  @Input() name;
  @Input() value;
  chosenValue;

  constructor() { }

  ngOnInit() {
    
  }

  writeValue(value) {
    this.chosenValue = value;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  onClick() {
    console.log('in onClick', this.chosenValue, this.value);
    this.onModelChange(this.value);
    this.onTouch();
  }
}
