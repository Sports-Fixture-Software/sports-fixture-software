import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Fixture } from '../models/fixture'
import { FixtureService } from '../services/fixture.service'
import { ButtonPopover } from './button_popover.component'
import { FixtureForm } from '../models/fixture.form'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html',
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES]
})

export class FixtureDetailsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private fixtureService: FixtureService,
        private changeref: ChangeDetectorRef) {
    }

    editing: boolean = false
    fixtureForm: FormGroup
    theName: string

    ngOnInit() {
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixture(id).then(fixture => {
                    this.fixture = fixture
                    this.changeref.detectChanges()
                })
            })
        this.fixtureForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            description: new FormControl('', [<any>Validators.required]),
            startDate: new FormControl('', [<any>Validators.required]),
            endDate: new FormControl('', [<any>Validators.required])
        })
    }

    onEditFixture() {
        this.editing = true
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.changeref.detectChanges()
    }

    updateFixture(form: FixtureForm) {
        this.editing = false
        this.changeref.detectChanges()
    }

    private fixture: Fixture;
}
