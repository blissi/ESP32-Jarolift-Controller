import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-ntp-help-dialog',
  templateUrl: './ntp-help-dialog.component.html'
})
export class NTPHelpDialog {
  ngOnInit() {
    // TODO
    // fetch("/gzip_ntp")
    //     .then((response) => response.text())
    //     .then((data) => {
    //       document.getElementById("p12_ntp_help_output").innerHTML = data;
    //       document.getElementById("p12_ntp_dialog").showModal();
    //     })
    //     .catch((error) => console.error("error loading data:", error));
  }
}
