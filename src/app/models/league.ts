/**
 * League
 */
export class League {
    private _id : number
    private _name : string
    private _createdOn : Date
    private _createdBy : string

    constructor(private theId : number,
                private theName : string,
                private theCreatedOn : Date,
                private theCreatedBy : string) {
        this.id = theId
        this.name = theName
        this.createdOn = theCreatedOn
        this.createdBy = theCreatedBy
    }

    get id() : number {
        return this._id
    }
    set id(theId : number)
    {
        this._id = theId
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