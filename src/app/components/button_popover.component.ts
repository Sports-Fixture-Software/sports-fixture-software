import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef} from '@angular/core'
import * as twitterBootstrap from 'bootstrap'
declare var jQuery: JQueryStatic;

@Component({
    selector: 'button-popover',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'button_popover.template.html'
})
export class ButtonPopover implements OnInit, AfterViewInit {
    @Input() errorTitle: String
    @Input() errorContent: String
    @Output('click') clickForwarder = new EventEmitter<Event>()
    @ViewChild('button') button: ElementRef

    constructor(private _changeref: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    onClick(event: Event) {
        this.clickForwarder.emit(event)
    }

    ngAfterViewInit() {
        jQuery(this.button.nativeElement).popover({ html: true })
    }

    showError(title: string, message: string) {
        this.button.nativeElement.setAttribute('data-original-title', title)

        this.errorContent = `<div class="alert alert-danger" role="alert"
        style="min-width:250px">
        <span class="glyphicon glyphicon-exclamation-sign"
            aria-hidden="true"></span>
            <span class="sr-only">${title}</span>${message}</div>`
        this._changeref.detectChanges()
        jQuery(this.button.nativeElement).popover('show')
    }

    hideError() {
        jQuery(this.button.nativeElement).popover('hide')
    }
}
