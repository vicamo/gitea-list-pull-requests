# Gitea List Pull Requests

Gitea action that lists pull requests with filtering conditions.

[![GitHub Super-Linter](https://gitea.com/vicamo/gitea-list-pull-requests/actions/workflows/linter.yml)](https://github.com/super-linter/super-linter)
![CI](https://gitea.com/vicamo/gitea-list-pull-requests/actions/workflows/ci.yml)
[![Check dist/](https://gitea.com/vicamo/gitea-list-pull-requests/actions/workflows/check-dist.yml)](https://gitea.com/vicamo/gitea-list-pull-requests/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/vicamo/gitea-list-pull-requests/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vicamo/gitea-list-pull-requests/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Usage

<!-- start usage -->

```yaml
- uses: vicamo/gitea-list-pull-requests@v1
  with:
    # Repository name with owner. For example,
    # vicamo/gitea-list-pull-requests
    #
    # Default: ${{ github.repository }}
    repository: ''

    # Access Token used to retrieve pull requests from the
    # specified the repository.
    #
    # [Learn more about generating and using access tokens.](https://docs.gitea.com/development/api-usage)
    #
    # Default: ${{ github.token }}
    token: ''

    # The server URL for the Gitea instance that you are
    # trying to enumerate pull requests from, will use
    # environment defaults from the same instance that the
    # workflow is running from unless specified. Example
    # URL is https://gitea.com.
    #
    # Default: ${{ github.server_url }}
    server_url: ''

    # State of pull request, e.g. open, closed, or all.
    #
    # Default: 'all'
    state: ''

    # A project milestone name. If the specified milestone
    # is not available for the specified project, it will
    # return an error.
    #
    # Default: ''
    milestone: ''

    # A multi-line string with one label name for each
    # line. If any of the specified label is not available
    # for the specified project, it will return an error.
    #
    # Default: ''
    labels: ''

    # Page number of results to return (1-based).
    page: ''

    # Page size of results.
    limit: ''
```

<!-- end usage -->

## Customizing

### inputs

The following inputs can be used as `step.with` keys:

| Name         | Type              | Default                    | Description                                            |
| :----------- | ----------------- | :------------------------- | :----------------------------------------------------- |
| `repository` | String            | `${{ github.repository }}` | Repository name with owner.                            |
| `token`      | String            | `${{ github.token }}`      | Access Token.                                          |
| `server_url` | String            | `${{ github.server_url }}` | The server URL.                                        |
| `state`      | String            | `all`                      | State of pull request, e.g. open, closed, or all.      |
| `milestone`  | String            |                            | A project milestone name.                              |
| `labels`     | Multi-line String |                            | A multi-line string with one label name for each line. |
| `page`       | Number            |                            | Page number of results to return (1-based).            |
| `limit`      | Number            |                            | Page size of results.                                  |

### outputs

The following outputs are available:

| Name   | Type   | Description                                   |
| :----- | ------ | :-------------------------------------------- |
| `json` | String | Array of pull requests object in JSON format. |

## Scenarios

- [List all pull requests of current repository](#list-all-pull-requests-of-current-repository)
- [List all pull requests of a different repository of a remote server](#list-all-pull-requests-of-a-different-repository-of-a-remote-server)
- [Additional filters for interested pull requests](#additional-filters-for-interested-pull-requests)
- [Pagination](#pagination)

### List all pull requests of current repository

```yaml
- uses: vicamo/gitea-list-pull-requests@v1
```

### List all pull requests of a different repository of a remote server

```yaml
- uses: vicamo/gitea-list-pull-requests@v1
  with:
    server_url: 'https://gitea.com'
    repository: 'gitea/awesome-gitea'
```

### Additional filters for interested pull requests

```yaml
- uses: vicamo/gitea-list-pull-requests@v1
  with:
    state: 'open'
    milestone: 'v1.0.0'
    labels: |
      kind/bug
      kind/feature
```

### Pagination

```yaml
- uses: vicamo/gitea-list-pull-requests@v1
  with:
    page: 2
    limit: 10
```

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
