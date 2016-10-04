import { FormControl, FormGroup } from '@angular/forms'

export class Validator {

    /**
     * Validator to ensure a non-negative whole number number, or blank.
     */
    static wholeNumberOrBlank = (control: FormControl): { [key: string]: any } => {
        if (control.value == null) {
            return null
        }
        if (typeof control.value === 'string' && control.value.trim() == '') {
            return null
        }
        if (Number(control.value) < 0) {
            return { Negative: true }
        }
        return Number.isInteger(Number(control.value)) ? null : { NaN: true }
    }

    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    static differentTeamsSelected = ({value}: FormGroup): { [key: string]: any } => {
        return value.homeTeam == value.awayTeam ? { equal: true } : null
    }
}
