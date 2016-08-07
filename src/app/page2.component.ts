import { Component } from '@angular/core';

declare var electron_remote: Electron.Remote;
import * as fs from 'fs';

@Component({
    moduleId: module.id,
    templateUrl : 'page2.template.html' 
})

export class Page2Component  {
    _path: string;
    _status: string;

    constructor() { 
        this._path = "";
    }

    public get path() {
        return this._path;
    }

    public get status() {
        return this._status;
    }

    public set path(value: string) {
        this._path = value;
        fs.exists(this._path, (exists) => {
            this._status = exists ? 'file exists' : 'file does not exist';
        });
    }

}
