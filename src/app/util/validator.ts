import { FormControl, FormGroup } from '@angular/forms'

export class Validator {
    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    static differentTeamsSelected = ({value}: FormGroup): { [key: string]: any } => {
        return value.homeTeam == value.awayTeam ? { equal: true } : null
    }
}
