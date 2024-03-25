/**
 * Unit tests for the action's input helper, src/input-helper.ts
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import * as ih from '../src/input-helper'

const DEFAULT_REPO_OWNER = 'gitea'
const DEFAULT_REPO_NAME = 'tea'
const DEFAULT_REPO = `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`
const DEFAULT_SERVER_URL = 'https://gitea.com'
const RANDOM_TOKEN = 'this_is_really_a_random_token'

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>

describe('get inputs', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()

    process.env = {
      GITHUB_REPOSITORY: DEFAULT_REPO,
      GITHUB_SERVER_URL: DEFAULT_SERVER_URL
    }

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  afterEach(() => {
    // Reset process.env after each test case
    process.env = originalEnv
  })

  function getInputDefault(name: string): string {
    switch (name) {
      case 'repository':
        return DEFAULT_REPO
      case 'token':
        return RANDOM_TOKEN
      case 'server_url':
        return DEFAULT_SERVER_URL
      default:
        throw new Error(`Unexpected input: ${name}`)
    }
  }

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
      token: d.token === undefined ? RANDOM_TOKEN : d.token,
      serverUrl: d.serverUrl === undefined ? DEFAULT_SERVER_URL : d.serverUrl
    }
  }

  it('invoked with all default inputs', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(getInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(buildInputSettings())
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test repository input option', async () => {
    const expectedOwner = 'a'
    const expectedName = 'b'
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return `${expectedOwner}/${expectedName}`
        default:
          return getInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      buildInputSettings({
        repositoryOwner: expectedOwner,
        repositoryName: expectedName
      })
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test empty repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return ''
        default:
          return getInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(buildInputSettings())
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test invalid repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return 'ab'
        default:
          return getInputDefault(name)
      }
    })

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid repository /)
  })

  it('test server_url input option', async () => {
    const expectedUrl = 'url'

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'server_url':
          return expectedUrl
        default:
          return getInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      buildInputSettings({ serverUrl: expectedUrl })
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test empty server_url input option', async () => {
    const expectedUrl = github.context.serverUrl

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'server_url':
          return ''
        default:
          return getInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      buildInputSettings({ serverUrl: expectedUrl })
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
