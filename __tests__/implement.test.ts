/**
 * Unit tests for the core implementation of the action, src/implement.ts
 */

import * as gitea from 'gitea-js'
import * as imp from '../src/implement'
import * as u from './utils'

describe('getPullRequests', () => {
  const getPullRequestsMock = jest.spyOn(imp, 'getPullRequests')

  const api = gitea.giteaApi(u.DEFAULT_SERVER_URL, { token: '' })

  let getMilestonesMock: jest.SpiedFunction<
    typeof api.repos.issueGetMilestonesList
  >
  let getLabelsMock: jest.SpiedFunction<typeof api.repos.issueListLabels>
  let listPullRequestsMock: jest.SpiedFunction<
    typeof api.repos.repoListPullRequests
  >

  type MResponse = Awaited<ReturnType<typeof api.repos.issueGetMilestonesList>>
  type LResponse = Awaited<ReturnType<typeof api.repos.issueListLabels>>
  type PRResponse = Awaited<ReturnType<typeof api.repos.repoListPullRequests>>

  beforeEach(() => {
    jest.clearAllMocks()

    getMilestonesMock = jest.spyOn(api.repos, 'issueGetMilestonesList')
    getLabelsMock = jest.spyOn(api.repos, 'issueListLabels')
    listPullRequestsMock = jest
      .spyOn(api.repos, 'repoListPullRequests')
      .mockImplementation(async () => {
        const resp = {} as PRResponse
        resp.data = []
        return resp
      })
  })

  it('invoked with all default inputs', async () => {
    const inputSettings = u.buildInputSettings()

    await expect(
      imp.getPullRequests(api, inputSettings)
    ).resolves.toMatchObject([])
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).not.toHaveBeenCalled()
    expect(getLabelsMock).not.toHaveBeenCalled()
    expect(listPullRequestsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      { state: inputSettings.state }
    )
  })

  it('throws in repoListPullRequests', async () => {
    const inputSettings = u.buildInputSettings()

    listPullRequestsMock.mockImplementation(async () => {
      const resp = {} as PRResponse
      resp.error = { message: 'Throws in repoListPullRequests.' }
      console.log(resp.error.message)
      throw resp
    })

    let error
    try {
      await imp.getPullRequests(api, inputSettings)
    } catch (e) {
      error = e
    }

    expect(error).toMatchObject({
      error: { message: 'Throws in repoListPullRequests.' }
    })
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).not.toHaveBeenCalled()
    expect(getLabelsMock).not.toHaveBeenCalled()
    expect(listPullRequestsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      { state: inputSettings.state }
    )
  })

  it('throws in issueGetMilestonesList', async () => {
    const inputSettings = u.buildInputSettings({
      state: 'open',
      milestone: 'a'
    })

    getMilestonesMock.mockImplementation(async () => {
      const resp = {} as MResponse
      resp.error = { message: 'Throws in issueGetMilestonesList.' }
      return resp
    })

    let error
    try {
      await imp.getPullRequests(api, inputSettings)
    } catch (e) {
      error = e
    }

    expect(error).toMatchObject(new Error('Throws in issueGetMilestonesList.'))
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      { state: 'all', name: inputSettings.milestone }
    )
    expect(getLabelsMock).not.toHaveBeenCalled()
    expect(listPullRequestsMock).not.toHaveBeenCalled()
  })

  it('throws in issueListLabels', async () => {
    const inputSettings = u.buildInputSettings({ state: 'open', labels: ['a'] })

    getLabelsMock.mockImplementation(async () => {
      const resp = {} as LResponse
      resp.error = { message: 'Throws in issueListLabels.' }
      return resp
    })

    let error
    try {
      await imp.getPullRequests(api, inputSettings)
    } catch (e) {
      error = e
    }

    expect(error).toMatchObject(new Error('Throws in issueListLabels.'))
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).not.toHaveBeenCalled()
    expect(getLabelsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName
    )
    expect(listPullRequestsMock).not.toHaveBeenCalled()
  })

  it('labels mismatch', async () => {
    const inputSettings = u.buildInputSettings({ state: 'open', labels: ['a'] })

    getLabelsMock.mockImplementation(async () => {
      const resp = {} as LResponse
      resp.data = inputSettings.labels.map((label, index) => {
        return { id: 1 + index, name: `${label}-mismatch` } as gitea.Label
      })
      return resp
    })

    let error
    try {
      await imp.getPullRequests(api, inputSettings)
    } catch (e) {
      error = e
    }

    expect(error).toMatchObject(
      new Error(`No such label '${inputSettings.labels[0]}' found.`)
    )
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).not.toHaveBeenCalled()
    expect(getLabelsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName
    )
    expect(listPullRequestsMock).not.toHaveBeenCalled()
  })

  it('invoked with milestone and labels', async () => {
    const inputMilestone = 'v0.10.0'
    const inputLabels = ['kind/feature', 'kind/enhancement']
    const inputSettings = u.buildInputSettings({
      state: 'open',
      milestone: inputMilestone,
      labels: inputLabels
    })

    getMilestonesMock.mockImplementation(async (_owner, _name, q) => {
      const resp = {} as MResponse
      resp.data = []
      if (q) resp.data.push({ id: 1, title: q.name } as gitea.Milestone)
      return resp
    })
    getLabelsMock.mockImplementation(async () => {
      const resp = {} as LResponse
      resp.data = inputLabels.map((label, index) => {
        return { id: 1 + index, name: label } as gitea.Label
      })
      return resp
    })

    await expect(
      imp.getPullRequests(api, inputSettings)
    ).resolves.toMatchObject([])

    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      { state: 'all', name: inputSettings.milestone }
    )
    expect(getLabelsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName
    )
    expect(listPullRequestsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      { state: inputSettings.state, milestone: 1, labels: [1, 2] }
    )
  })

  it('invoked with page/limit', async () => {
    const inputSettings = u.buildInputSettings({ page: 1, limit: 1 })

    await expect(
      imp.getPullRequests(api, inputSettings)
    ).resolves.toMatchObject([])
    expect(getPullRequestsMock).toHaveReturned()
    expect(getMilestonesMock).not.toHaveBeenCalled()
    expect(getLabelsMock).not.toHaveBeenCalled()
    expect(listPullRequestsMock).toHaveBeenCalledWith(
      inputSettings.repositoryOwner,
      inputSettings.repositoryName,
      {
        state: inputSettings.state,
        page: inputSettings.page,
        limit: inputSettings.limit
      }
    )
  })
})
