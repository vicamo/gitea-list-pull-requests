/**
 * Unit tests for the action's input helper, src/input-helper.ts
 */

import * as core from '@actions/core'
import * as ih from '../src/input-helper'
import * as u from './utils'

describe('get inputs', () => {
  // Mock the GitHub Actions core library
  let getInputMock: jest.SpiedFunction<typeof core.getInput>
  let getMultilineInputMock: jest.SpiedFunction<typeof core.getMultilineInput>

  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getMultilineInputMock = jest
      .spyOn(core, 'getMultilineInput')
      .mockImplementation()
  })

  it('invoked with all default inputs', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(u.getInputDefault)
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(u.buildInputSettings())
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
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      u.buildInputSettings({
        repositoryOwner: expectedOwner,
        repositoryName: expectedName
      })
    )
  })

  it('test empty repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return ''
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid repository /)
  })

  it('test invalid repository input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'repository':
          return 'ab'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

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
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      u.buildInputSettings({ serverUrl: expectedUrl })
    )
  })

  it('test empty server_url input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'server_url':
          return ''
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid server_url /)
  })

  it('test open state input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'state':
          return 'open'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(u.buildInputSettings({ state: 'open' }))
  })

  it('test closed state input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'state':
          return 'closed'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      u.buildInputSettings({ state: 'closed' })
    )
  })

  it('test empty state input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'state':
          return ''
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid state /)
  })

  it('test illegal state input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'state':
          return 'unexpected'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid state /)
  })

  it('test single-lined labels input option', async () => {
    const expectedLabel = 'hello'

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(u.getInputDefault)
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(name => {
      switch (name) {
        case 'labels':
          return [expectedLabel]
        default:
          return u.getMultilineInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      u.buildInputSettings({ labels: [expectedLabel] })
    )
  })

  it('test multi-lined labels input option', async () => {
    const expectedLabels = ['a', 'b', 'c']

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(u.getInputDefault)
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(name => {
      switch (name) {
        case 'labels':
          return expectedLabels
        default:
          return u.getMultilineInputDefault(name)
      }
    })

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(
      u.buildInputSettings({ labels: expectedLabels })
    )
  })

  it('test page input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'page':
          return '123'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(u.buildInputSettings({ page: 123 }))
  })

  it('test invalid page input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'page':
          return 'not a number'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid page /)
  })

  it('test limit input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'limit':
          return '123'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    const inputSettings = await ih.getInputSettings()

    expect(inputSettings).toMatchObject(u.buildInputSettings({ limit: 123 }))
  })

  it('test invalid limit input option', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'limit':
          return 'not a number'
        default:
          return u.getInputDefault(name)
      }
    })
    // Set the action's inputs as return values from core.getMultilineInput()
    getMultilineInputMock.mockImplementation(u.getMultilineInputDefault)

    expect.assertions(1)
    await expect(ih.getInputSettings()).rejects.toThrow(/^Invalid limit /)
  })
})
