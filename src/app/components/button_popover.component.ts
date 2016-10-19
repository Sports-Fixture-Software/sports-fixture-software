import { Component, Input, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core'
import * as twitterBootstrap from 'bootstrap'
declare var jQuery: JQueryStatic;

@Component({
    selector: 'button-popover',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'button_popover.template.html'
})
export class ButtonPopover implements AfterViewInit, OnDestroy {
    @Input() errorTitle: String
    @Input() errorContent: String
    @Input('disabled') disabled: boolean
    @Input('type') theType: String
    @Input('btn-class') klass: string
    @Input('btn-aria-label') ariaLabel: string
    @Output('click') onClick = new EventEmitter<Event>()
    @ViewChild('button') button: ElementRef

    constructor(private _changeref: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        jQuery(this.button.nativeElement).popover({ html: true }).on('hidden.bs.popover', () => {
            this.state = State.Hidden
        }).on('shown.bs.popover', () => {
            this.state = State.Shown
        })
        document.addEventListener('mousedown', this.onDocumentMouseDown)
    }

    showError(title: string, message: string) {
        this.button.nativeElement.setAttribute('data-original-title', title)
        this.errorContent = `<div class="alert alert-danger" role="alert"
        style="min-width:250px">
        <span class="glyphicon glyphicon-exclamation-sign"
            aria-hidden="true"></span>
            <span class="sr-only">${title}</span>${message}</div>`
        this._changeref.detectChanges()
        if (this.state == State.Hidden) {
            this.showErrorPopup()
        }
    }

    hideError() {
        if (this.state == State.Shown) {
            this.hideErrorPopup()
        }
    }

    ngOnDestroy() {
        document.removeEventListener('mousedown', this.onDocumentMouseDown)
        jQuery(this.button.nativeElement).off('hidden.bs.popover').off('shown.bs.popover')
    }

    private showErrorPopup() {
        jQuery(this.button.nativeElement).popover('show')
    }

    private hideErrorPopup() {
        let data = jQuery(this.button.nativeElement).popover('hide').data('bs.popover')
        if (data && data.inState) {
            // needed to work around a bug in Twitter bootstrap
            // where requires two clicks to show popup
            // http://stackoverflow.com/a/14857326
            data.inState.click = false
        }
    }

    private onDocumentMouseDown = () => {
        this.hideError()
    }

    private state: State = State.Hidden
}
enum State {
    Hidden,
    Shown
}
