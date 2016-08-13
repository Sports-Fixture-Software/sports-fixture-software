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

    public getLeagues() : Promise<League[]> {
        return new Promise<League[]>((resolve, reject) => {
            this.db.all(`SELECT * FROM League;`, (err: Error, rows: any[]) => {
                if (err) {
                    return reject(err)
                }
                var leagues : League[] = []
                for (var row of rows)
                {
                    var createdOn : Date;
                    if (row.createdOn == null || row.createdOn == undefined)
                    {
                        createdOn = null
                    } else {
                        createdOn = new Date(row.createdOn)
                    }
                    leagues.push(new League(row.id, row.name, createdOn,
                                            row.createdBy))
                }
                return resolve(leagues)
            })
        })
    }

    public getLeague(id: Number) : Promise<League> {
        return new Promise<League>((resolve, reject) => {
            this.db.get(`SELECT * FROM League WHERE id = ?`, id, (err, row) => {
                if (err) {
                    return reject(err);
                }
                return resolve(new League(row.id, row.name, row.createdOn, row.createdBy))
            });
        });
    }

    public addLeague(name: String) : Promise<League> {
        return new Promise<Number>((resolve, reject) => {
            this.db.run(`INSERT INTO League (name) VALUES (?)`, name, function(err) {
                if (err) {
                    return reject(err);
                }
                return resolve(this.lastID);
            })
        }).then(id => {
            return this.getLeague(id);
        });
    }

    public close()
    {
        if (this.db) {
            this.db.close()
        }
    }
}
