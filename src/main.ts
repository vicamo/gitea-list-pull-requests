import * as core from '@actions/core'
import * as ih from './input-helper'
import * as gitea from 'gitea-js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputSettings = await ih.getInputSettings()
    const api = gitea.giteaApi(`${inputSettings.serverUrl}`, {
      token: inputSettings.token
    })
    const resp = await api.repos.repoListPullRequests(
      `${inputSettings.repositoryOwner}`,
      `${inputSettings.repositoryName}`
    )

    // Set outputs for other workflow steps to use
    core.setOutput('json', JSON.stringify(resp.data))
  } catch (error) {
    core.error('Failed to fetch pull requests')
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
