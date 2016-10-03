import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../services/breadcrumb.service';

@Component({
    selector: 'navbar',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'navbar.template.html'
})
export class Navbar implements OnInit {
    @Input() title: string;
    breadcrumbs: Breadcrumb[];
    
    constructor(private router: Router,
                private breadcrumbService: BreadcrumbService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.breadcrumbService.getBreadgrumbs().subscribe((crumbs: Breadcrumb[]) => {
            this.breadcrumbs = crumbs;
        });
    }

    public navigateToBreadcrumb(breadcrumb: Breadcrumb) {
        this.router.navigate(breadcrumb.urlComponents);
    }

}
