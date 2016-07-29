///<reference path="../typings/index.d.ts" />
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';
import * as electron from 'electron';


@Component({
    selector: 'app',
    template : `<h1>Welcome to Angular2</h1>
    <div>Electron app running from {{path}}</div>` 
})

export class App {
    path: String;
    ipc = electron.ipcRenderer;

    constructor() {
        this.ipc.send('get-app-path');
        this.ipc.on('got-app-path', (event, path) => {
            this.path = path;
        });
    }
}

bootstrap(App);
