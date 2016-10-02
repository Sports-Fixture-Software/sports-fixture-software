import { Component, Input, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef} from '@angular/core'
import { REACTIVE_FORM_DIRECTIVES, FormGroup } from '@angular/forms'
import * as twitterBootstrap from 'bootstrap'
declare var jQuery: JQueryStatic;

@Component({
    selector: 'input-popover',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'input_popover.template.html',
    directives: [REACTIVE_FORM_DIRECTIVES],
})

/**
 * A form input control, that displays an error popover via `showError`.
 * The error popover is used to inform the user why their input fails
 * validation.
 */
export class InputPopover implements AfterViewInit, OnDestroy {
    @Input('inputFormControlName') theFormControlName: String
    @Input() errorContent: String
    @Input('formGroup') form: FormGroup
    @Input('type') theType: String
    @Input('input-class') klass: string
    @ViewChild('input') input: ElementRef

    constructor(private _changeref: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.popover = jQuery(this.input.nativeElement).popover({ html: true, template: InputPopover.popoverTemplate, content: 'Please enter a number', placement: 'bottom', trigger: 'manual' }).on('show.bs.popover', () => {
            this.state = State.Showing
        }).on('shown.bs.popover', () => {
            this.state = State.Shown
        }).on('hide.bs.popover', () => {
            this.state = State.Hidding
        }).on('hidden.bs.popover', () => {
            this.state = State.Hidden
        })
    }

    ngOnDestroy() {
        if (this.popover) {
            this.popover.off()
            this.popover.popover('hide')
        }
    }

    /**
     * Show the `message` via a popover.
     */
    showError(message: string) {
        this.errorContent = message
        this._changeref.detectChanges()
        if (this.popover) {
            if (this.state == State.Hidden) {
                this.popover.popover('show')
            } else if (this.state == State.Hidding) {
                this.popover.one('hidden.bs.popover', () => {
                    this.popover.popover('show')
                })
            }
        }
    }

    /**
     * Hides the error popover.
     */
    hideError() {
        if (this.popover) {
            if (this.state == State.Shown) {
                this.popover.popover('hide')
            } else if (this.state == State.Showing) {
                this.popover.one('shown.bs.popover', () => {
                    this.popover.popover('hide')
                })
            }
        }    
    }

    private popover: JQuery
    private state: State = State.Hidden
    private static popoverTemplate = '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="alert alert-danger alert-popover" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">title</span><div class="popover-content popover-content-s"></div></div></div>'
}

enum State {
    Hidden,
    Hidding,
    Shown,
    Showing
}
