import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy, ElementRef, ChangeDetectorRef} from '@angular/core'
import { PopoverContent } from 'ng2-popover';
import { Subscription } from 'rxjs/Subscription'

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

    constructor(private _changeref: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (this.popover) {
            this.closeSubscription = this.popover.onCloseFromOutside.subscribe(() => {
                this.onPopoverClose()
            })
        }
    }

    onClick() {
        this.hidden = false
    }

    onPopoverClose() {
        this.hidden = !this.hovering
    }

    onMouseEnter() {
        this.hovering = true
        if (this.popover.top < 0) {
            this.hidden = false
        }
    }

    onMouseLeave() {
        this.hovering = false
        if (this.popover.top < 0) {
            this.hidden = true
        }
    }

    ngOnDestroy() {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe()
        }
    }

    private hidden: boolean = true
    private hovering: boolean = false
    private closeSubscription: Subscription
}
