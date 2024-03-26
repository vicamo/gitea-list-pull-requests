# Gitea Actions Template Using TypeScript

[![GitHub Super-Linter](https://gitea.com/vicamo/gitea-actions-template/actions/workflows/linter.yml)](https://github.com/super-linter/super-linter)
![CI](https://gitea.com/vicamo/gitea-actions-template/actions/workflows/ci.yml)
[![Check dist/](https://gitea.com/vicamo/gitea-actions-template/actions/workflows/check-dist.yml)](https://gitea.com/vicamo/gitea-actions-template/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/vicamo/gitea-actions-template/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/vicamo/gitea-actions-template/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## What's new

- point 1
- point 2

## Usage

<!-- start usage -->

```yaml
- uses: vicamo/gitea-actions-template@main
  with:
    # Your input description here
    #
    # Default: 1000
    milliseconds: 1000
```

<!-- end usage -->

## Customizing

### inputs

The following inputs can be used as `step.with` keys:

| Name           | Type   | Default | Description                 |
| -------------- | ------ | ------- | --------------------------- |
| `milliseconds` | Number | 1000    | Your input description here |

### outputs

The following outputs are available:

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| `time` | String | Your output description here |

## Scenarios

- [Scenario 1](#scenario-1)
- [Scenario 2](#scenario-2)

### Scenario 1

```yaml
- uses: vicamo/gitea-actions-template@main
```

### Scenario 2

```yaml
- uses: vicamo/gitea-actions-template@main
  with:
    milliseconds: 2500
```

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
