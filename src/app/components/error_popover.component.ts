import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';

@Component({
    selector: 'error-popover',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'error_popover.template.html',
    directives: [ POPOVER_DIRECTIVES]
})
export class ErrorPopover implements OnInit {
    @Input() title: String
    @Input() message: String
    @ViewChild('popoverContent') popoverContent: PopoverContent

    constructor() {
    }

    ngOnInit() {
    }
}
