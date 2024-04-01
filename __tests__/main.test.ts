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
import * as u from './utils'

describe('action', () => {
  // Mock the action's main function
  const runMock = jest.spyOn(main, 'run')

  // Mock the GitHub Actions core library
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
  let setOutputMock: jest.SpiedFunction<typeof core.setOutput>
  let getInputSettingsMock: jest.SpiedFunction<typeof ih.getInputSettings>

  beforeEach(() => {
    jest.clearAllMocks()

    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    getInputSettingsMock = jest
      .spyOn(ih, 'getInputSettings')
      .mockImplementation()
  })

  it(
    'invoked with all default inputs',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenNthCalledWith(
        1,
        'json',
        expect.stringMatching(/^\[.*\]$/)
      )
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with invalid repo owner/name',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({
          repositoryOwner: 'a',
          repositoryName: 'b',
          token: ''
        })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    u.TIMEOUT_ERROR_SECONDS * 1000
  )

  it(
    'invoked with an invalid token',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: 'invalid_token' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with an invalid server_url',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', serverUrl: 'an invalid url' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    u.TIMEOUT_ERROR_SECONDS * 1000
  )

  it(
    'invoked with open state',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', state: 'open' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with closed state',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', state: 'closed' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with an invalid milestone',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', milestone: 'no such milestone' })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with milestone and labels',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({
          token: '',
          milestone: 'v0.10.0',
          labels: ['kind/feature', 'kind/enhancement']
        })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with a single-lined label',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', labels: ['kind/bug'] })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with an invalid label',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', labels: ['no such label'] })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).not.toHaveBeenCalled()
      expect(setFailedMock).toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )

  it(
    'invoked with page/limit',
    async () => {
      // Set the action's inputs as return values from ih.getInputSettings()
      getInputSettingsMock.mockImplementation(async () =>
        u.buildInputSettings({ token: '', page: 1, limit: 1 })
      )

      await main.run()

      expect(runMock).toHaveReturned()
      expect(setOutputMock).toHaveBeenCalled()
      expect(setFailedMock).not.toHaveBeenCalled()
    },
    u.TIMEOUT_SECONDS * 1000
  )
})
