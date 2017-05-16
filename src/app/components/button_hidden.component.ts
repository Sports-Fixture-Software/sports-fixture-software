/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

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
        if (!this.popoverVisible()) {
            this.buttonJQuery.fadeIn(this.fadeSpeed)
        }
    }

    onMouseLeave() {
        this.hovering = false
        if (!this.popoverVisible()) {
            this.buttonJQuery.fadeOut(this.fadeSpeed)
        }
    }

    ngOnDestroy() {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe()
        }
    }

    /**
     * ng2-popover library doesn't provide a way of detecting if a popover is
     * visible. It does set top to -1000 when hidden, can use that.
     */
    private popoverVisible(): boolean {
        return this.popover.top > -1000
    }

    private buttonJQuery: JQuery
    private fadeSpeed: number = 200
    private hovering: boolean = false
    private closeSubscription: Subscription
}
