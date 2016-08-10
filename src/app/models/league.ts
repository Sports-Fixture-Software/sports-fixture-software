/**
 * League
 */
export class League {
    private _name : string
    private _createdOn : Date
    private _createdBy : string
    constructor(private theName : string) {
        name = theName
    }
    get name() : string {
        return this._name
    }
    set name(theName : string)
    {
        this._name = theName
    }

    get createdOn() : Date {
        return this._createdOn
    }
    set createdOn(theCreatedOn : Date)
    {
        this._createdOn = theCreatedOn
    }

    get createdBy() :string {
        return this._createdBy
    }
    set createdBy(theCreatedBy : string)
    {
        this._createdBy = theCreatedBy
    }
}