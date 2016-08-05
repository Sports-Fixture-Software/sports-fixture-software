import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

declare var electron_remote: Electron.Remote;

@Component({
    selector: 'app',
    template : `<h1>Welcome to Angular2</h1>
    <div>Electron app running. Click Count: {{clickCount}}</div>
    <button (click)="showMessage()">Click Me</button>` 
})

export class AppComponent implements OnInit {
    clickCount: number;

    constructor() { }

    ngOnInit() {
        this.clickCount = 0;
    }

    showMessage() {
        this.clickCount++;
        if (this.clickCount == 5) {
            electron_remote.dialog.showMessageBox({
                type: "info",
                buttons: ['Ok'],
                title: "Good Clicking",
                message: "You just clicked the button 5 times. Well done!"
            });
        }
    }
}
