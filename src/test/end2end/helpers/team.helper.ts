import * as webdriverio from 'webdriverio'

/**
 * end-to-end function to create a new team.
 * `name` is the team name.
 */
export function createTeam(client: webdriverio.Client<any>, name: string): webdriverio.Client<boolean> {
    return client.waitForVisible('[aria-label="Create Team"]').then(() => {
        return client.click('[aria-label="Create Team"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="Team Name"]')
    }).then(() => {
        return client.setValue('input[aria-label="Team Name"]', name)
    }).then(() => {
        return client.submitForm('input[aria-label="Team Name"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="Team Name"]', undefined, true)
    })
} 
