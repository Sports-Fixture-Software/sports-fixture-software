import { Component, OnInit, ChangeDetectorRef, } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FixtureService } from '../services/fixture.service'
import { Collection } from '../services/collection'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import * as electron from 'electron' 
import * as fs from 'fs'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService],
    templateUrl: 'review.template.html'
})

export class ReviewComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }

    error: Error

    ngOnInit() {
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._fixtureService.getFixture(id).then((f) => {
                    this.fixture = f
                    return this._fixtureService.getRoundsAndMatches(f)
                }).then((rounds: Collection<Round>) => {
                    this.rounds = rounds.toArray()
                    this._changeref.detectChanges()
                }).catch((err: Error) => {
                    let detail = err ? err.message : ''
                    this.error = new Error(`Error loading rounds: ${detail}`)
                    this._changeref.detectChanges()
                })
            })
    }

    onSaveFixture() {
        new Promise((resolve, reject) => { electron.remote.dialog.showSaveDialog(
            {
                title: "Save Fixture",
                buttonLabel: "Save Fixture",
                filters: [
                    { name: 'CSV', extensions: ['csv'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            }, (res : string[]) => {
                if (res) {
                    return resolve(res)
                } else {
                    return reject(new Error("Unable to save the fixture to that location"))
                }
            })
        }).then((res: string[]) => {
            if (res && res.length > 0) {
                fs.createWriteStream(res[0])
            }
        })
    }

    private rounds: Round[] = []
    private fixture: Fixture
}
