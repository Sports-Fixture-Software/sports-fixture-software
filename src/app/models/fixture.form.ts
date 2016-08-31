import * as moment from 'moment'

export interface FixtureForm {
    name: string,
    description: string,
    startDate: moment.Moment,
    startDateEnabled: boolean,
    endDate: Date,
    endDateEnabled: boolean
}
