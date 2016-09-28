import { Component, OnInit, ChangeDetectorRef, } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FixtureService } from '../services/fixture.service'
import { Collection } from '../services/collection'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import { FileFolder } from '../util/file_folder'
import { ExportTo } from '../util/export_to'
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
        this.showSaveDialog().then((res: string) => {
            return FileFolder.createWriteStream(res)
        }).then((stream: fs.WriteStream) => {
            ExportTo.CSV(stream, this.rounds)
            stream.end()
            stream.close()
        }).catch((err: Error) => {
            if (err instanceof UserCancelled) {
                // ignore
            } else {
                console.log(err)
            }
        })
    }

    /**
     * Shows the save as dialog.
     *
     * Returns a string of the selected file.
     */
    private showSaveDialog(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            electron.remote.dialog.showSaveDialog(
                {
                    title: "Save Fixture",
                    buttonLabel: "Save Fixture",
                    filters: [
                        { name: 'CSV', extensions: ['csv'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                }, (res: string) => {
                    if (res) {
                        return resolve(res)
                    } else {
                        return reject(new UserCancelled())
                    }
                })
        })
    }

    private rounds: Round[] = []
    private fixture: Fixture
}

class UserCancelled extends Error { }
