import * as core from '@actions/core'
import * as ih from './input-helper.js'
import * as imp from './implement.js'
import * as gitea from 'gitea-js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputSettings = await ih.getInputSettings()
    const api = gitea.giteaApi(`${inputSettings.serverUrl}`, {
      token: inputSettings.token
    })

    const requests = await imp.getPullRequests(api, inputSettings)

    // Set outputs for other workflow steps to use
    core.setOutput('json', JSON.stringify(requests))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
    else core.setFailed('Failed to fetch pull requests')
  }
}
