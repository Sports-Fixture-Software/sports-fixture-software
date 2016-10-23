import { FormControl, FormGroup } from '@angular/forms'
export class Validator {

    /**
     * Validator to ensure an integer is greater than the `target` number
     * provided, or blank.
     */
    static integerGreaterEqualOrBlank = (target: number) => {
        return (control: FormControl): { [key: string]: any } => {
            if (control.value == null) {
                return null
            }
            if (typeof control.value === 'string' && control.value.trim() == '') {
                return null
            }
            let num = Number(control.value)
            if (Number.isNaN(num)) {
                return { NaN: true }
            }
            if (!Number.isInteger(num)) {
                return { NotInteger: true }
            }
            if (num < target) {
                return { NotGreater: true }
            }
            return null
        }
    }

    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    static differentTeamsSelected = ({value}: FormGroup): { [key: string]: any } => {
        return new Promise(resolve => {
            if (value.homeTeam == value.awayTeam) {
                resolve({equal: true})
            } else {
                resolve(null);
            }
        })
    }
    /**
     * Minimum number allowed for consecutive home/ away games constraint
     */
    static CONSECUTIVE_GAMES_MIN: number = 2
}
