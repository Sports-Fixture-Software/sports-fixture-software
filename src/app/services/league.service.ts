import { Injectable } from '@angular/core';
import { League } from '../models/league';
import * as sqlite from 'sqlite3'

@Injectable()
export class LeagueService {

    private db : sqlite.Database
    private dbFilename : string = 'sanfl_fixture_software.database'

    // TODO: error handling on database open/create
    // TODO: database filename from a configuration file
    constructor() {
        this.db = new sqlite.Database(this.dbFilename, (err: Error) => {
            if (err) {
                throw `Unable to open database '${this.dbFilename}'.`
            }
            this.db.serialize(() => {
                this.db.run(`CREATE TABLE IF NOT EXISTS League
                (id INTEGER PRIMARY KEY ASC,
                 name TEXT NOT NULL,
                 createdOn TEXT,
                 createdBy TEXT);`)
            })
        })
     }

    // TODO: error handling
    // TODO: don't return any, return models League type
    public async getLeagues() : Promise<any[]> {
        var promise : Promise<any[]>
        promise = new Promise<any[]>((resolve, reject) => {
            this.db.all(`SELECT * FROM League;`, (err: Error, rows: any[]) => {
                if (err) {
                    reject([])
                }
                resolve(rows)
            })
        })
        return promise
    }

    public close()
    {
        if (this.db) {
            this.db.close()
        }
    }
}
