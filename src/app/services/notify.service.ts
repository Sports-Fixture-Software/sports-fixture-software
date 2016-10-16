import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

/**
 * A notify service so 'separated' components can communicate. Components
 * normally communicate via parent/child relationship, but if the components
 * are 'separated' via <router-outlet> they can communicate via this service.
 */
@Injectable()
export class NotifyService {
    private generateStateSource = new Subject<GenerateState>()
    generateState$ = this.generateStateSource.asObservable()

    /**
     * Emit 'generated' notification - a notification that a fixture has
     * successfully been generated.
     */
    emitGenerateState(state: GenerateState) {
        this.generateStateSource.next(state)
    }
}

export enum GenerateState {
    Generating,
    Generated
}
