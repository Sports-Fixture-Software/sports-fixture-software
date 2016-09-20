import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'

/**
 * A notify service so 'separated' components can communicate. Components
 * normally communicate via parent/child relationship, but if the components
 * are 'separated' via <router-outlet> they can communicate via this service.
 */
@Injectable()
export class NotifyService {
    private generatedSource = new Subject<boolean>()
    generated$ = this.generatedSource.asObservable()

    /**
     * Emit 'generated' notification - a notification that a fixture has
     * successfully been generated.
     */
    emitGenerated(value: boolean) {
        this.generatedSource.next(value)
    }
}
