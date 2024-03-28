import * as core from '@actions/core'

export interface IInputSettings {
  /**
   * The repository owner
   */
  repositoryOwner: string

  /**
   * The repository name
   */
  repositoryName: string

  /**
   * The auth token to use when fetching the repository
   */
  token: string

  /**
   * User override on the Gitea Server/Host URL
   */
  serverUrl: string

  /**
   * State of pull request
   */
  state: string

  /**
   * A project milestone name
   */
  milestone: string

  /**
   * A multi-line string with one label name for each line
   */
  labels: string[]
}

export async function getInputSettings(): Promise<IInputSettings> {
  const result = {} as unknown as IInputSettings

  // Qualified repository
  const qualifiedRepository = core.getInput('repository')
  core.debug(`qualified repository = '${qualifiedRepository}'`)
  const splitRepository = qualifiedRepository.split('/')
  if (
    splitRepository.length !== 2 ||
    !splitRepository[0] ||
    !splitRepository[1]
  ) {
    throw new Error(
      `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`
    )
  }
  result.repositoryOwner = splitRepository[0]
  result.repositoryName = splitRepository[1]

  // Auth token
  result.token = core.getInput('token')

  // Determine the GitHub URL that the repository is being hosted from
  result.serverUrl = core.getInput('server_url')
  core.debug(`Gitea server URL = ${result.serverUrl}`)
  if (!result.serverUrl)
    throw new Error(`Invalid server_url '${result.serverUrl}'`)

  const state = core.getInput('state')
  switch (state) {
    case 'all':
      result.state = 'all'
      break
    case 'open':
      result.state = 'open'
      break
    case 'closed':
      result.state = 'closed'
      break
    default:
      throw new Error(`Invalid state '${state}'`)
  }

  result.milestone = core.getInput('milestone')

  result.labels = core.getMultilineInput('labels')

  return result
}
