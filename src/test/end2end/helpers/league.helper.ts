import * as webdriverio from 'webdriverio'

export function createLeague(client: webdriverio.Client<any>, name: string): webdriverio.Client<boolean> {
    return client.waitForExist('[aria-label="Create League"]').then((found) => {
        expect(found).toBe(true)
        return client.click('[aria-label="Create League"]')
    }).then((res) => {
        return client.isVisible('input[aria-label="League Name"]')
    }).then((exists) => {
        expect(exists).toBe(true)
        return client.setValue('input[aria-label="League Name"]', name)
    }).then(() => {
        return client.submitForm('input[aria-label="League Name"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="League Name"]', undefined, true)
    })
}
