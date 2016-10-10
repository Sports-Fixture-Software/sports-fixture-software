import * as webdriverio from 'webdriverio'

export function createFixture(client: webdriverio.Client<any>, name: string, description?: string): webdriverio.Client<boolean> {
    return client.waitForVisible('[aria-label="Create Fixture"]').then(() => {
        return client.click('[aria-label="Create Fixture"]')
    }).then(() => {
        return client.waitForVisible('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        return client.setValue('input[aria-labelledby="fixtureName"]', name)
    }).then(() => {
        if (description) {
            return client.setValue('input[aria-labelledby="fixtureDescription"]', description)
        }
    }).then(() => {
        return client.submitForm('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        return client.waitForVisible('input[aria-labelledby="fixtureName"]', undefined, true)
    })
} 
