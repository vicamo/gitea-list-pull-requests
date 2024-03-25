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

    const query: Parameters<typeof api.repos.repoListPullRequests>[2] = {}
    switch (inputSettings.state) {
      case 'all':
        query.state = 'all'
        break
      case 'open':
        query.state = 'open'
        break
      case 'closed':
        query.state = 'closed'
        break
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
      const names: string[] = []
      for (let name of inputSettings.labels) {
        name = name.trim()
        if (name.length) names.push(name)
      }

      if (names.length) {
        const ids: number[] = []

        const resp = await api.repos.issueListLabels(
          `${inputSettings.repositoryOwner}`,
          `${inputSettings.repositoryName}`
        )

        for (const name of names) {
          let found = false
          for (const label of resp.data) {
            if (label.name === name) {
              ids.push(label.id as number)
              found = true
              break
            }
          }

          if (!found) throw new Error(`No such label '${name}' found.`)
        }

        query.labels = ids
      }
    }

    const resp = await api.repos.repoListPullRequests(
      `${inputSettings.repositoryOwner}`,
      `${inputSettings.repositoryName}`,
      query
    )

    // Set outputs for other workflow steps to use
    core.setOutput('json', JSON.stringify(resp.data))
  } catch (error) {
    core.error('Failed to fetch pull requests')
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
