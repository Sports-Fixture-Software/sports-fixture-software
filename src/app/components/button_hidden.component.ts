import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core'
import { PopoverContent } from 'ng2-popover'
import { Subscription } from 'rxjs/Subscription'
declare var jQuery: JQueryStatic;

@Component({
    selector: 'button-hidden',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'button_hidden.template.html'
})
export class ButtonHidden implements OnInit, OnDestroy {
    @Input('popover') popover: PopoverContent
    @Input('popoverPlacement') popoverPlacement: String
    @Output('click') onClickEvent = new EventEmitter<Event>()
    @ViewChild('button') button: ElementRef

    ngOnInit() {
        if (this.popover) {
            this.closeSubscription = this.popover.onCloseFromOutside.subscribe(() => {
                this.onPopoverClose()
            })
        }
        if (this.button) {
            this.buttonJQuery = jQuery(this.button.nativeElement)
        }
    }

    onClick() {
        this.buttonJQuery.fadeIn(this.fadeSpeed)
    }

    onPopoverClose() {
        if (this.hovering) {
            this.buttonJQuery.fadeIn(this.fadeSpeed)
        } else {
            this.buttonJQuery.fadeOut(this.fadeSpeed)
        }
    }

    onMouseEnter() {
        this.hovering = true
        if (this.popover.top < 0) {
            this.buttonJQuery.fadeIn(this.fadeSpeed)
        }
    }

    onMouseLeave() {
        this.hovering = false
        if (this.popover.top < 0) {
            this.buttonJQuery.fadeOut(this.fadeSpeed)
        }
    }

    ngOnDestroy() {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe()
        }
    }

    private buttonJQuery: JQuery
    private fadeSpeed: number = 200
    private hovering: boolean = false
    private closeSubscription: Subscription
}
