import * as ih from './input-helper.js'
import * as gitea from 'gitea-js'

export async function getPullRequests(
  api: gitea.Api<unknown>,
  inputSettings: ih.IInputSettings
): Promise<gitea.PullRequest[]> {
  const query: Parameters<typeof api.repos.repoListPullRequests>[2] = {
    state: inputSettings.state
  }

  if (inputSettings.milestone.length) {
    const resp = await api.repos.issueGetMilestonesList(
      `${inputSettings.repositoryOwner}`,
      `${inputSettings.repositoryName}`,
      { state: 'all', name: inputSettings.milestone }
    )
    if (resp.error) throw new Error(resp.error.message)
    query.milestone = resp.data[0].id
  }

  if (inputSettings.labels.length) {
    const resp = await api.repos.issueListLabels(
      `${inputSettings.repositoryOwner}`,
      `${inputSettings.repositoryName}`
    )
    if (resp.error) throw new Error(resp.error.message)
    query.labels = inputSettings.labels.map((label) => {
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

  return resp.data
}
