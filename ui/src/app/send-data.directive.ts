import { Directive, ElementRef, inject, Input } from '@angular/core';
import { CommunicationService } from './communication.service';

@Directive({
  selector: '[appSendData]'
})
export class SendDataDirective {
  private el = inject(ElementRef);

  constructor(comm: CommunicationService) {
    const nativeElement = this.el.nativeElement as HTMLElement;
    
    if (nativeElement.tagName === "BUTTON") {
      nativeElement.addEventListener("click", () => {
        if (this.appSendData) {
          comm.sendData(this.appSendData, true);
        }
      });
    }
    else if (nativeElement.tagName === "INPUT") {
      const inputElem = nativeElement as HTMLInputElement;
      const type = inputElem.type;

      if (type === "checkbox" || type === "radio") {
        inputElem.addEventListener("change", () => {
          if (this.appSendData) {
            comm.sendData(this.appSendData, inputElem.checked);
          }
        });
      }
      else if (type === "range" || type === "select") {
        inputElem.addEventListener("change", () => {
          if (this.appSendData) {
            comm.sendData(this.appSendData, inputElem.value);
          }
        });
      }
      else if (type === "text" || type === "number" || type === "password" || type === "date" || type === "time" || type === "url") {
        inputElem.addEventListener("blur", () => {
          // Check if the element exists and is a password field
          if (type === "password") {
            // Only send the data if the value is not "XxXxXxXxXxX"
            if (inputElem.value === "XxXxXxXxXxX") {
              console.log(`Password field (${this.appSendData}) not updated, skipping send.`);
              return;
            }
          }

          if (this.appSendData) {
            comm.sendData(this.appSendData, inputElem.value);
          }
        });

        inputElem.addEventListener("keypress", e => {
          if (e.key === "Enter") {
            inputElem.blur(); // Triggers "blur" event and sends data
          }
        });
      }
      else {
        console.error("Unsupported HTML element: can't send data to the device.", nativeElement);
      }
    }
  }

  @Input() appSendData = "";
}