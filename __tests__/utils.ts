/**
 * Test utility functions.
 */

import * as ih from '../src/input-helper'

export const DEFAULT_REPO_OWNER = 'gitea'
export const DEFAULT_REPO_NAME = 'tea'
export const DEFAULT_REPO = `${DEFAULT_REPO_OWNER}/${DEFAULT_REPO_NAME}`
export const DEFAULT_SERVER_URL = 'https://gitea.com'
export const DEFAULT_TOKEN = 'default-token'

export const TIMEOUT_ERROR_SECONDS = 10
export const TIMEOUT_SECONDS = 60

export function getInputDefault(name: string): string {
  switch (name) {
    case 'repository':
      return DEFAULT_REPO
    case 'token':
      return DEFAULT_TOKEN
    case 'server_url':
      return DEFAULT_SERVER_URL
    case 'state':
      return 'all'
    case 'milestone':
    case 'labels':
    case 'page':
    case 'limit':
      return ''
    default:
      throw new Error(`Unexpected input: ${name}`)
  }
}

export function getMultilineInputDefault(name: string): string[] {
  switch (name) {
    case 'labels':
      return []
    default:
      throw new Error(`Unexpected input: ${name}`)
  }
}

export function buildInputSettings(
  d: {
    repositoryOwner?: string
    repositoryName?: string
    token?: string
    serverUrl?: string
    state?: 'closed' | 'open' | 'all'
    milestone?: string
    labels?: string[]
    page?: number
    limit?: number
  } = {}
): ih.IInputSettings {
  return {
    repositoryOwner:
      d.repositoryOwner === undefined ? DEFAULT_REPO_OWNER : d.repositoryOwner,
    repositoryName:
      d.repositoryName === undefined ? DEFAULT_REPO_NAME : d.repositoryName,
    token: d.token === undefined ? DEFAULT_TOKEN : d.token,
    serverUrl: d.serverUrl === undefined ? DEFAULT_SERVER_URL : d.serverUrl,
    state: d.state === undefined ? 'all' : d.state,
    milestone: d.milestone === undefined ? '' : d.milestone,
    labels: d.labels === undefined ? [] : d.labels,
    page: d.page === undefined ? 0 : d.page,
    limit: d.limit === undefined ? 0 : d.limit
  }
}
