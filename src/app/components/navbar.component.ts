import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'navbar',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'navbar.template.html'
})
export class Navbar implements OnInit {
    @Input() title: string;
    
    constructor() {
    }

    ngOnInit() {
    }

}
