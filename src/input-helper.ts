import * as core from '@actions/core'
import * as github from '@actions/github'

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
  serverUrl: string | undefined
}

export async function getInputSettings(): Promise<IInputSettings> {
  const result = {} as unknown as IInputSettings

  // Qualified repository
  const qualifiedRepository =
    core.getInput('repository') ||
    `${github.context.repo.owner}/${github.context.repo.repo}`
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
  result.token = core.getInput('token', { required: true })

  // Determine the GitHub URL that the repository is being hosted from
  result.serverUrl =
    core.getInput('server_url') || `${github.context.serverUrl}`
  core.debug(`Gitea server URL = ${result.serverUrl}`)

  return result
}
