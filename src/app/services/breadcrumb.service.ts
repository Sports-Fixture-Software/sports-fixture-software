import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Breadcrumb {
    public constructor(title: String, urlComponents: String[]) {
        this.title = title;
        this.urlComponents = urlComponents;
    }

    public title: String;
    public urlComponents: String[];

}

@Injectable()
export class BreadcrumbService {
    private crumbs: BehaviorSubject<Breadcrumb[]>;

    public constructor() {
        this.crumbs = new BehaviorSubject<Breadcrumb[]>([]);
        this.crumbs.next([
            new Breadcrumb("Leagues", ["/"]),
        ]);
    }

    public getBreadgrumbs(): BehaviorSubject<Breadcrumb[]> {
        return this.crumbs;
    }

    public setBreadcrumbs(crumbs: Breadcrumb[]) {
        this.crumbs.next(crumbs);
    }


    /**
     * Provides the seccond to last breadcrumb. If less than 
     * two breadcrumbs, it retuns undefined.
     */
    public getParentBreadcrumb(): Breadcrumb {
        var numberOfCrumbs = this.crumbs.value.length;
        
        if (numberOfCrumbs < 2)
            return undefined;

        return this.crumbs.value[numberOfCrumbs - 1];
    }
}
