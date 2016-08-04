///<reference path="../../typings/index.d.ts" />

import { bootstrap } from '@angular/platform-browser-dynamic';
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

declare var electron: any;

@Component({
    selector: 'app',
    template : `<h1>Welcome to Angular2</h1>
    <div>Electron app running. Click Count: {{clickCount}}</div>
    <button (click)="showMessage()">Click Me</button>` 
})

export class AppComponent {
    private remote = electron.remote;

    clickCount: number;

    constructor() {
        this.clickCount = 0;
        // remote.dialog.showMessageBox({
        //     type: "info",
        //     buttons: ['Ok'],
        //     title: "test",
        //     message: "test"
        // });
        // this.ipc.send('get-app-path');
        // this.ipc.on('got-app-path', (event, path) => {
        //     this.path = path;
        // });
    }

    showMessage() {
        this.clickCount++;
        if (this.clickCount == 5) {
            this.remote.dialog.showMessageBox({
                type: "info",
                buttons: ['Ok'],
                title: "Good Clicking",
                message: "You just clicked the button 5 times. Well done!"
            });
        }
    }
}

bootstrap(AppComponent);
