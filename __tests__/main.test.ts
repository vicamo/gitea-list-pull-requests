/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as ih from '../src/input-helper'
import * as main from '../src/main'

const DEFAULT_REPO_OWNER = 'vicamo'
const DEFAULT_REPO_NAME = 'gitea-list-pull-requests'
const DEFAULT_SERVER_URL = 'https://gitea.com'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const reqArrayRegex = /^\[.*\]$/

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>
let getInputSettingsMock: jest.SpiedFunction<typeof ih.getInputSettings>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    getInputSettingsMock = jest
      .spyOn(ih, 'getInputSettings')
      .mockImplementation()
  })

  function buildInputSettings(
    d: {
      repositoryOwner?: string
      repositoryName?: string
      token?: string
      serverUrl?: string
    } = {}
  ): ih.IInputSettings {
    return {
      repositoryOwner:
        d.repositoryOwner === undefined
          ? DEFAULT_REPO_OWNER
          : d.repositoryOwner,
      repositoryName:
        d.repositoryName === undefined ? DEFAULT_REPO_NAME : d.repositoryName,
      token: d.token === undefined ? '' : d.token,
      serverUrl: d.serverUrl === undefined ? DEFAULT_SERVER_URL : d.serverUrl
    }
  }

  it(
    'invoked with all default inputs',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () => buildInputSettings())

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenNthCalledWith(
        1,
        'json',
        expect.stringMatching(reqArrayRegex)
      )
      expect(setFailedMock).not.toHaveBeenCalled()
      expect(errorMock).not.toHaveBeenCalled()
    },
    60 * 1000
  )

  it(
    'invoked with invalid repo owner/name',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ repositoryOwner: 'a', repositoryName: 'b' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
      expect(errorMock).toHaveBeenCalled()
    },
    10 * 1000
  )

  it(
    'invoked with an invalid token',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ token: 'invalid_token' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
      expect(errorMock).toHaveBeenCalled()
    },
    10 * 1000
  )

  it(
    'invoked with an invalid server_url',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ serverUrl: 'an invalid url' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
      expect(errorMock).toHaveBeenCalled()
    },
    10 * 1000
  )
})
