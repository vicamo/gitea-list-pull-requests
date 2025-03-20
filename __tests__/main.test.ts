/**
 * Unit tests for the action's main functionality, src/main.ts
 */

import * as core from '@actions/core'
import * as gitea from 'gitea-js'
import * as ih from '../src/input-helper'
import * as imp from '../src/implement'
import * as main from '../src/main'
import * as u from './utils'

describe('run', () => {
  // Mock the action's main function
  const runMock = jest.spyOn(main, 'run')

  // Mock the GitHub Actions core library
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
  let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

  let getInputSettingsMock: jest.SpiedFunction<typeof ih.getInputSettings>
  let getPullRequestsMock: jest.SpiedFunction<typeof imp.getPullRequests>

  type PullRequests = Awaited<ReturnType<typeof imp.getPullRequests>>

  beforeEach(() => {
    jest.clearAllMocks()

    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    getPullRequestsMock = jest.spyOn(imp, 'getPullRequests')
    getInputSettingsMock = jest.spyOn(ih, 'getInputSettings')
  })

  it('invoked with all default inputs', async () => {
    const inputSettings = u.buildInputSettings()
    const expectedPRs: PullRequests = []

    getInputSettingsMock.mockImplementation(async () => inputSettings)
    getPullRequestsMock.mockImplementation(async () => expectedPRs)

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getInputSettingsMock).toHaveBeenCalledTimes(1)
    expect(getPullRequestsMock).toHaveBeenCalledTimes(1)
    expect(setOutputMock).toHaveBeenCalledWith(
      'json',
      JSON.stringify(expectedPRs)
    )
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('throw Error in getPullRequests', async () => {
    const inputSettings = u.buildInputSettings()
    const expectedMessage = 'An Error'

    getInputSettingsMock.mockImplementation(async () => inputSettings)
    getPullRequestsMock.mockImplementation(async () => {
      throw new Error(expectedMessage)
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getInputSettingsMock).toHaveBeenCalledTimes(1)
    expect(getPullRequestsMock).toHaveBeenCalledTimes(1)
    expect(setOutputMock).not.toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(expectedMessage)
  })

  it('throw non-Error in getPullRequests', async () => {
    const inputSettings = u.buildInputSettings()
    const _api = gitea.giteaApi(inputSettings.serverUrl, {
      token: inputSettings.token
    })
    type PRResponse = Awaited<
      ReturnType<typeof _api.repos.repoListPullRequests>
    >

    getInputSettingsMock.mockImplementation(async () => inputSettings)
    getPullRequestsMock.mockImplementation(async () => {
      const resp = {} as PRResponse
      resp.error = { message: 'A failure' }
      throw resp
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getInputSettingsMock).toHaveBeenCalledTimes(1)
    expect(getPullRequestsMock).toHaveBeenCalledTimes(1)
    expect(setOutputMock).not.toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('Failed to fetch pull requests')
  })
})
