import { Component } from '@angular/core';

declare var electron_remote: Electron.Remote;

@Component({
    moduleId: module.id,
    templateUrl : 'page1.template.html' 
})

export class Page1Component  {
    clickCount: number;

    constructor() {
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
