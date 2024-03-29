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

const DEFAULT_REPO_OWNER = 'gitea'
const DEFAULT_REPO_NAME = 'tea'
const DEFAULT_SERVER_URL = 'https://gitea.com'

const TIMEOUT_ERROR_SECONDS = 10
const TIMEOUT_SECONDS = 60

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const reqArrayRegex = /^\[.*\]$/

// Mock the GitHub Actions core library
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>
let getInputSettingsMock: jest.SpiedFunction<typeof ih.getInputSettings>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

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
      state?: string
      milestone?: string
      labels?: string[]
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
      serverUrl: d.serverUrl === undefined ? DEFAULT_SERVER_URL : d.serverUrl,
      state: d.state === undefined ? 'all' : d.state,
      milestone: d.milestone === undefined ? '' : d.milestone,
      labels: d.labels === undefined ? [] : d.labels
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
    },
    TIMEOUT_SECONDS * 1000
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
      expect(setFailedMock).toHaveBeenCalled()
    },
    TIMEOUT_ERROR_SECONDS * 1000
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
      expect(setFailedMock).toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
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
      expect(setFailedMock).toHaveBeenCalled()
    },
    TIMEOUT_ERROR_SECONDS * 1000
  )

  it(
    'invoked with open state',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ state: 'open' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with closed state',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ state: 'closed' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with an invalid milestone',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ milestone: 'no such milestone' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with milestone and labels',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({
          milestone: 'v0.10.0',
          labels: ['kind/feature', 'kind/enhancement']
        })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with a single-lined label',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ labels: ['kind/bug'] })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with an invalid label',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        buildInputSettings({ labels: ['no such label'] })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    TIMEOUT_SECONDS * 1000
  )
})
