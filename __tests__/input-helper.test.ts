/**
 * Unit tests for the action's input helper, src/input-helper.ts
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import * as ih from '../src/input-helper'

const DEFAULT_REPO_OWNER = 'vicamo'
const DEFAULT_REPO_NAME = 'gitea-list-pull-requests'
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
      GITHUB_REPOSITORY: `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`,
      GITHUB_SERVER_URL: DEFAULT_SERVER_URL
    }

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  afterEach(() => {
    // Reset process.env after each test case
    process.env = originalEnv
  })

  it('invoked with all default inputs', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return DEFAULT_SERVER_URL
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject({
      repositoryOwner: DEFAULT_REPO_OWNER,
      repositoryName: DEFAULT_REPO_NAME,
      token: RANDOM_TOKEN,
      serverUrl: DEFAULT_SERVER_URL
    } as ih.IInputSettings)
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
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return DEFAULT_SERVER_URL
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject({
      repositoryOwner: expectedOwner,
      repositoryName: expectedName,
      token: RANDOM_TOKEN,
      serverUrl: DEFAULT_SERVER_URL
    } as ih.IInputSettings)
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test empty repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return ''
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return DEFAULT_SERVER_URL
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject({
      repositoryOwner: DEFAULT_REPO_OWNER,
      repositoryName: DEFAULT_REPO_NAME,
      token: RANDOM_TOKEN,
      serverUrl: DEFAULT_SERVER_URL
    } as ih.IInputSettings)
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test invalid repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return 'ab'
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return DEFAULT_SERVER_URL
        default:
          throw new Error(`Unexpected input: ${name}`)
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
        case 'repository':
          return `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return expectedUrl
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject({
      repositoryOwner: DEFAULT_REPO_OWNER,
      repositoryName: DEFAULT_REPO_NAME,
      token: RANDOM_TOKEN,
      serverUrl: expectedUrl
    } as ih.IInputSettings)
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('test empty server_url input option', async () => {
    const expectedUrl = github.context.serverUrl

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`
        case 'token':
          return RANDOM_TOKEN
        case 'server_url':
          return ''
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject({
      repositoryOwner: DEFAULT_REPO_OWNER,
      repositoryName: DEFAULT_REPO_NAME,
      token: RANDOM_TOKEN,
      serverUrl: expectedUrl
    } as ih.IInputSettings)
    expect(errorMock).not.toHaveBeenCalled()
  })
})
