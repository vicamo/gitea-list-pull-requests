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

    const query: Parameters<typeof api.repos.repoListPullRequests>[2] = {
      state: inputSettings.state
    }

    if (inputSettings.milestone.length) {
      const resp = await api.repos.issueGetMilestonesList(
        `${inputSettings.repositoryOwner}`,
        `${inputSettings.repositoryName}`,
        { state: 'all', name: inputSettings.milestone }
      )
      const milestones = resp.data
      if (milestones.length === 0)
        throw new Error(`No such milestone '${inputSettings.milestone}' found.`)
      else query.milestone = milestones[0].id
    }

    if (inputSettings.labels.length) {
      const resp = await api.repos.issueListLabels(
        `${inputSettings.repositoryOwner}`,
        `${inputSettings.repositoryName}`
      )

      query.labels = inputSettings.labels.map(label => {
        for (const result of resp.data) {
          if (result.name === label) return result.id as number
        }

        throw new Error(`No such label '${label}' found.`)
      })
    }

    if (inputSettings.page > 0) query.page = inputSettings.page

    if (inputSettings.limit > 0) query.limit = inputSettings.limit

    const resp = await api.repos.repoListPullRequests(
      `${inputSettings.repositoryOwner}`,
      `${inputSettings.repositoryName}`,
      query
    )

    // Set outputs for other workflow steps to use
    core.setOutput('json', JSON.stringify(resp.data))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
    else core.setFailed('Failed to fetch pull requests')
  }
}
