import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


const maxReconnectDelay: number = 5000;
const minReconnectDelay: number = 1000;


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private ws!: WebSocket;
  private heartbeatTimeout?: ReturnType<typeof setTimeout>;
  private reconnectDelay: number = minReconnectDelay;

  constructor(private translateService: TranslateService) {
    this.setupWS();
  }

  private setupWS(): void {
    if (this.isGitHubPages()) {
      console.log("localhost or github.io detected, skipping WebSocket setup");
      return;
    }

    console.log("WebSocket setup started");
    this.ws = new WebSocket("ws://" + window.location.host + "/ws");
    this.ws.onopen = () => this.onopen();
    this.ws.onclose = () => this.onclose();
    this.ws.onerror = error => this.onerror(error);
    this.ws.onmessage = event => this.onmessage(event);
  }

  private isGitHubPages(): boolean {
    return (
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("github.io")
    );
  }

  private onopen(): void {
    console.log("WebSocket connected");
    this.resetHeartbeat();
    this.hideReloadBar();
    this.reconnectDelay = minReconnectDelay;
  }

  private onclose(): void {
    console.log("WebSocket disconnected. Retrying...");
    this.attemptReconnect();
    this.showReloadBar();
  }

  private onerror(error: any): void {
    console.log("WebSocket error:", error);
  }

  private onmessage(event: any): void {
    // TODO
    const message = JSON.parse(event.data);
    //console.log(message);
    if (message.type === "redirect") {
      console.log("Redirecting to:", message.url);
      this.ws.close();
      window.location.href = message.url;
    } else if (message.type === "heartbeat") {
      this.resetHeartbeat();
    } else if (message.type === "loadConfig") {
      this.loadConfig();
    } else if (message.type === "updateText") {
      this.updateText(message);
    } else if (message.type === "setLanguage") {
      this.setLanguage(message);
    } else if (message.type === "updateJSON") {
      this.updateJSON(message);
    } else if (message.type === "updateValue") {
      this.updateValue(message);
    } else if (message.type === "updateState") {
      this.updateState(message);
    } else if (message.type === "updateSetIcon") {
      this.updateSetIcon(message);
    } else if (message.type === "hideElement") {
      this.hideElement(message);
    } else if (message.type === "updateHref") {
      this.updateHref(message);
    } else if (message.type === "updateBusy") {
      this.updateBusy(message);
    } else if (message.type === "updateDisabled") {
      this.updateDisabled(message);
    } else if (message.type === "showElementClass") {
      this.showElementClass(message);
    } else if (message.type === "logger") {
      this.logger(message);
    } else if (message.type === "cmdLogClr") {
      this.cmdLogClr();
    } else if (message.type === "otaProgress") {
      this.otaProgress(message);
    } else if (message.type === "updateDialog") {
      this.updateDialog(message);
    } else if (message.type === "showInfoMsg") {
      this.showMsgBar(message);
    }
  }

  // to show reload bar if connection is lost
  private showReloadBar() {
    document.getElementById("connectionLostBar")!.style.display = "flex";
  }

  // to hide reload bar if connection is lost
  private hideReloadBar() {
    document.getElementById("connectionLostBar")!.style.display = "none";
  }

  private showMsgBar(message) {
    const msgBar = document.getElementById("msgBar") as HTMLDivElement;
    const msgBarText = document.getElementById("msgBarText") as HTMLDivElement;

    // update the message text
    msgBarText.textContent = message.text;
    msgBar.style.display = "block";

    // Force reflow to start slide-down animation
    void msgBar.offsetWidth;

    // slide up the message bar
    msgBar.classList.add("visible");

    // hide the message bar after 2 seconds
    setTimeout(() => {
      msgBar.classList.remove("visible");

      setTimeout(() => {
        msgBar.style.display = "none";
      }, 500);
    }, 2500);
  }

  // heartbeat function
  private resetHeartbeat() {
    clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = setTimeout(() => {
      console.warn("No heartbeat received, reconnecting...");
      this.ws.close();
      this.showReloadBar();
    }, 5000);
  }

  private attemptReconnect() {
    setTimeout(() => {
      console.log(`Attempting reconnect in ${this.reconnectDelay / 1000} seconds...`);
      this.setupWS();
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, maxReconnectDelay);
    }, this.reconnectDelay);
  }

  private restartFunction() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName)) {
      activeElement.blur(); // save last active input
    }

    // add a delay to be sure the last input is complete
    setTimeout(() => {
      this.sendData("restartAction", "true");
    }, 1000);
  }

  public sendData(elementId, value) {
    // check if the page is hosted on localhost or GitHub Pages
    if (this.isGitHubPages()) {
      console.log("localhost or github.io detected, skipping sendData");
      return;
    }

    if (this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "sendData",
        elementId: elementId,
        value: String(value),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send data.");
    }
  }

  private updateText(data) {
    var element = document.getElementById(data.id) as HTMLInputElement;
    //console.log(element);
    if (element) {
      if (data.isInput) {
        element.value = data.text;
      } else {
        element.innerHTML = data.text;
      }
    }
  }

  private setLanguage(data: any) {
    console.log("Set language to:", data.language);
    this.translateService.use(data.language);
  }

  private updateJSON(data) {
    Object.keys(data).forEach(function (key) {
      if (key !== "type") {
        // skip first element "type"
        let elementID = key;
        let element = document.getElementById(elementID) as HTMLInputElement;
        if (!element) {
          console.error("unknown element:", key);
          return;
        }
        let value = data[key];

        if (element.tagName === "INPUT") {
          if (element.type === "checkbox" || element.type === "radio") {
            element.checked = value === "true";
          } else if (element.type === "range") {
            element.value = value;
            let linkedTextElementId = element.getAttribute("data-value-id");
            if (linkedTextElementId) {
              let linkedTextElement =
                document.getElementById(linkedTextElementId);
              if (linkedTextElement) {
                linkedTextElement.innerHTML = value;
              }
            }
          } else {
            // all other input elements
            element.value = value;
          }
        } else if (element.tagName === "SELECT") {
          element.value = value;
          // check if value is valid
          if (
            !Array.from((element as any as HTMLSelectElement).options).some((option) => option.value === value)
          ) {
            console.warn(
              `Value "${value}" not found in <select> options for element:`,
              key
            );
          }
        } else if (element.tagName === "I") {
          // change icons <i>
          element.className = "svg " + value;
        } else if ("innerHTML" in element) {
          // all other elements with `innerHTML` (<td>, <div>, <span>, ...)
          element.innerHTML = value;
        } else {
          console.error("unhandled element type:", (element as any).tagName);
        }
      }
    });
  }

  private updateValue(data) {
    var element = document.getElementById(data.id) as HTMLInputElement;
    if (element) {
      if (data.isInput) {
        element.value = data.value;
      }
    }
  }

  // update switch elements
  private updateState(data) {
    var element = document.getElementById(data.id) as HTMLInputElement;
    if (element && (element.type === "checkbox" || element.type === "radio")) {
      element.checked = data.state;
      this.toggleElementVisibility((element as any).getAttribute("hideOpt"), element.checked);
    }
  }

  // update add class to element
  private updateSetIcon(data) {
    var element = document.getElementById(data.id);
    if (element) {
      element.className = "svg " + data.icon;
    }
  }

  // hide/show element
  private hideElement(data) {
    var element = document.getElementById(data.id);
    if (element) {
      element.style.display = data.hide ? "none" : "";
    }
  }

  // update href
  private updateHref(data) {
    var element = document.getElementById(data.id) as HTMLAnchorElement;
    if (element) {
      element.href = data.href;
    }
  }

  // update Busy
  private updateBusy(data) {
    var element = document.getElementById(data.id);
    if (element) {
      element.setAttribute("aria-busy", data.busy);
    }
  }

  // disable/enable element
  private updateDisabled(data) {
    var element = document.getElementById(data.id) as HTMLInputElement;
    if (element) {
      element.disabled = data.disabled;
    }
  }

  // hide/show elements based on className
  private showElementClass(data) {
    const elements = document.querySelectorAll(`.${data.className}`);
    elements.forEach((element) => {
      (element as HTMLElement).style.display = data.show ? "inline-flex" : "none";
    });
  }

  // add log message
  private logger(data) {
    var logOutput = document.getElementById("p10_log_output")!;
    if (data.cmd === "add_log") {
      logOutput.innerHTML = "";
      data.entry.forEach(function (entry) {
        logOutput.innerHTML += entry + "<br>";
      });
    } else if (data.cmd === "clr_log") {
      this.cmdLogClr();
    }
  }

  // clear log
  private cmdLogClr() {
    const logOutput = document.getElementById("p10_log_output")!;
    logOutput.innerHTML = "";
  }

  // update ota-progress bar
  private otaProgress(data) {
    clearTimeout(this.heartbeatTimeout);
    var progress = data.progress;
    (document.getElementById("ota_progress_bar") as HTMLProgressElement).value = progress;
    document.getElementById("ota_status_txt")!.textContent = `Update Progress: ${progress}%`;
  }

  // close update dialog
  private updateDialog(data) {
    const dialog = document.getElementById(data.id) as HTMLDialogElement;
    if (data.state == "open") {
      dialog.showModal();
    } else if (data.state == "close") {
      dialog.close();
    }
  }

  // Function for switching the visibility of elements
  private toggleElementVisibility(className: string, isVisible: boolean) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      if (element.tagName.toLowerCase() === "option") {
        (element as HTMLOptionElement).disabled = !isVisible;
      } else {
        (element as HTMLElement).style.display = isVisible ? "" : "none";
      }
    });
  }

  // Function for initializing the visibility based on the status of the switches
  private initializeVisibilityBasedOnSwitches() {
    document
      .querySelectorAll('input[type="checkbox"][role="switch"]')
      .forEach((switchElement) => {
        // Evaluate the status of the switch and adjust visibility
        this.toggleElementVisibility(
          (switchElement as any).getAttribute("hideOpt"),
          (switchElement as HTMLInputElement).checked
        );
      });
  }

  // OTA: function is called when the ota-file is selected
  private ota_sub_fun(obj) {
    var a = obj.value;
    console.log(a);
    var fileName = a.replace(/^.*[\\\/]/, "");
    console.log(fileName);
    (document.getElementById("ota_file_input") as HTMLInputElement).textContent = fileName;
    (document.getElementById("ota_update_btn") as HTMLButtonElement).disabled = false;
    (document.getElementById("ota_progress_bar") as HTMLElement).style.display = "block";
    (document.getElementById("ota_status_txt") as HTMLElement).style.display = "block";
  }

  // CONFIG-FORM: function for download config.json file
  private exportConfig() {
    var a = document.createElement("a");
    a.href = "/config-download";
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private validateHex(input) {
    // Entferne alles außer gültigen HEX-Zeichen und '0x', und stelle sicher, dass Großbuchstaben verwendet werden
    input.value = input.value.replace(/[^0-9a-fA-F]/g, "").toLowerCase();
  }

  private formatHex(input) {
    const length = parseInt(input.getAttribute("data-length"), 10) || 6; // Standardlänge: 6
    // Auffüllen mit führenden Nullen entsprechend der gewünschten Länge
    input.value = input.value.padStart(length, "0").toLowerCase();
  }

  private validateBin(input) {
    // Entferne alles außer 0 und 1
    input.value = input.value.replace(/[^0-1]/g, "");
  }

  private formatBin(input) {
    const length = parseInt(input.getAttribute("data-length"), 10) || 16; // Standardlänge: 16
    input.value = input.value.padStart(length, "0");
  }

  private validateIP(input) {
    // IPv4-Validierung
    const ipPattern =
      /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    if (!ipPattern.test(input.value.trim())) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.setAttribute("aria-invalid", "false");
      this.sendData(input.id, input.value);
    }
  }

  // update elements based on config.json file
  private updateUI(config, prefix = "cfg", ignoreKeys = ["version"]) {
    console.log("updating config");
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        // Prüfen, ob der aktuelle Schlüssel ignoriert werden soll
        if (ignoreKeys.includes(key)) {
          console.log("config update - key ignored: " + key);
          continue;
        }

        const value = config[key];
        const elementId = `${prefix}_${key}`;

        // Überprüfen, ob das aktuelle Element ein verschachteltes Objekt ist
        if (typeof value === "object" && value !== null) {
          // Rekursiv weiter ins Objekt gehen, mit dem erweiterten Prefix
          this.updateUI(value, elementId, ignoreKeys);
        } else {
          // UI-Element mit dem zusammengesetzten ID suchen
          const element = document.getElementById(elementId) as HTMLInputElement;
          if (element) {
            // Unterscheide die Art des HTML-Elements
            if (element.type === "checkbox") {
              // Setze das "checked"-Attribut für Checkboxen
              element.checked = value === true;
              this.toggleElementVisibility(
                (element as any).getAttribute("hideOpt"),
                element.checked
              );
            } else if (element.type === "radio") {
              // Setze das "checked"-Attribut für Radio-Buttons
              element.checked = element.value === value.toString();
            } else if (element.tagName === "SELECT") {
              // Setze den "value"-Attribut für <select>-Elemente
              element.value = value;

              // Prüfen, ob im globalen Scope eine Funktion updateUIcallbackSelect existiert
              if (typeof (window as any).updateUIcallbackSelect === "function") {
                (window as any).updateUIcallbackSelect(elementId, value);
              }
            } else if (element.type === "password") {
              // Always set password fields to "XxXxXxXxXxX" as a placeholder
              element.value = "XxXxXxXxXxX";
            } else {
              // Überprüfen, ob das Feld ein HEX- oder Binärwert benötigt
              if (element.dataset["type"] === "hex" && typeof value === "number") {
                // Konvertiere Zahl zu HEX und setze den Wert
                element.value = value.toString(16).toLowerCase();
                this.formatHex(element);
              } else if (
                element.dataset["type"] === "bin" &&
                typeof value === "number"
              ) {
                // Konvertiere Zahl zu Binär und setze den Wert
                element.value = value.toString(2);
                this.formatBin(element);
              } else {
                // Setze den "value"-Attribut für andere Eingabetypen (z.B. text, number)
                element.value = value;
              }
            }
          } else {
            console.error("config update - elementId not found: " + elementId);
          }
        }
      }
    }
    this.synchronizeDataSyncFields();
  }

  // load and update config
  private async loadConfig() {
    console.log("loading config");
    try {
      const response = await fetch("config.json");
      if (!response.ok)
        throw new Error("Fehler beim Abrufen der Konfigurationsdaten");

      const config = await response.json();

      // update UI-Elementes based on config.json
      this.updateUI(config);
    } catch (error) {
      console.error("Error loading config:", error);
    }
  }

  private synchronizeDataSyncFields() {
    // find all input fields with data-sync
    const inputs = document.querySelectorAll("input[data-sync]") as any as HTMLInputElement[];

    inputs.forEach((inputElement) => {
      // split data-sync IDs by comma
      const syncIds = inputElement.dataset["sync"]?.split(",") || [];

      syncIds.forEach((syncId) => {
        const syncElement = document.getElementById(syncId.trim());

        if (syncElement) {
          // initial synchronization
          syncElement.textContent = inputElement.value;

          // synchronize user inputs
          inputElement.addEventListener("input", (event) => {
            syncElement.textContent = (event.target as HTMLInputElement).value;
          });

          // check for programmed changes
          const observer = new MutationObserver(() => {
            syncElement.textContent = inputElement.value;
          });

          observer.observe(inputElement, {
            attributes: true,
            attributeFilter: ["value"],
          });
        }
      });
    });
  }

  private toggleEdit(button, inputId) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    console.log("button pressed");
    if (button.innerText === "Edit") {
      input.disabled = false;
      input.focus();
      button.innerText = "Lock";
      console.log("button edit");
    } else {
      input.blur();
      input.disabled = true;
      button.innerText = "Edit";
      console.log("button save");
    }
  }
}
