<!-- markdownlint-disable MD013 MD024 -->

# Changelog

## [1.0.2](https://github.com/vicamo/gitea-actions-template/compare/v1.0.1...v1.0.2) (2024-03-27)

### 🧰 Maintenance

- release-please: update SemVer tags as well
  ([989a13c](https://github.com/vicamo/gitea-actions-template/commit/989a13ca6a8c624c6d4265889f497a723a44218e))

## [1.0.1](https://github.com/vicamo/gitea-actions-template/compare/v1.0.0...v1.0.1) (2024-03-26)

### 🧰 Maintenance

- markdownlint: disable MD013,MD024 for CHANGELOG.md
  ([1c227a8](https://github.com/vicamo/gitea-actions-template/commit/1c227a888ef4abbf959d935298211498ff92f32d))
- release-please: disable include-component-in-tag
  ([f171d62](https://github.com/vicamo/gitea-actions-template/commit/f171d62a86d483a0a4dc363b8fe62d8128642a4f))

## 1.0.0 (2024-03-26)

### 🐛 Bugfixes

- bump up Node.js to v16
  ([b8a5078](https://github.com/vicamo/gitea-actions-template/commit/b8a50788a5e60adb83f66ceb9c1e4e7874faffc6))
- fixes jest globals type error
  ([922b4cb](https://github.com/vicamo/gitea-actions-template/commit/922b4cbaff78add83dbff45932d07b95795c5ab6))
- support unknown catch variable
  ([#377](https://github.com/vicamo/gitea-actions-template/issues/377))
  ([40c0b26](https://github.com/vicamo/gitea-actions-template/commit/40c0b260f8c8b9b69d90b613272feb82178ce5ac))

### 🧰 Maintenance

- add release-please support
  ([ea41ebd](https://github.com/vicamo/gitea-actions-template/commit/ea41ebd985b01a6565ab3de618a1ede9c58fbcda))
- bump up the required Node.js version
  ([8178840](https://github.com/vicamo/gitea-actions-template/commit/8178840eb03ed8f05e7872fab77934f961315797))
- codeql: run on GitHub only
  ([703e46a](https://github.com/vicamo/gitea-actions-template/commit/703e46a9e28651671ef0faed0c24c8c8f45dfe5e))
- **dev-deps:** bump up ESLint family to resolve ERESOLVE during the
  installation phase
  ([06795f3](https://github.com/vicamo/gitea-actions-template/commit/06795f34ce9c4d8ccb9823e404b88550aa8a8ad0))
- **dev-deps:** bump up TypeScript to resolve TS6046 during the compilation
  phase
  ([21895be](https://github.com/vicamo/gitea-actions-template/commit/21895be435f46b9171c6a30cb80466674d66cc38))
- drop codeql workflow
  ([d3ff55a](https://github.com/vicamo/gitea-actions-template/commit/d3ff55a2600492b4327933de3a165eda1827b1fc))
- fix formatting
  ([3126511](https://github.com/vicamo/gitea-actions-template/commit/31265117a81b1bb18682183355de7a9b3e5fa86b))
- Fix the "main" in package.json to point to a file that actually exists.
  ([296c2aa](https://github.com/vicamo/gitea-actions-template/commit/296c2aa43ae41d6076d00a3393462b88e1c95e34))
- linter: skip markdownlint line length checks for tables
  ([aaaec83](https://github.com/vicamo/gitea-actions-template/commit/aaaec8352effb759a70f55b04bf327d09da7c699))
- release-please: specify config and manifest
  ([f321a74](https://github.com/vicamo/gitea-actions-template/commit/f321a74e6557de75bfa0b8dd9c8939f5adb5c95b))
- release-please: specify token
  ([76eb57a](https://github.com/vicamo/gitea-actions-template/commit/76eb57ad4a1d3c2e741b8a78d41ecf4fb5facd7d))
- release-please: support push to npm as well
  ([3b46a82](https://github.com/vicamo/gitea-actions-template/commit/3b46a8258949edbafcb3478b72b75933911092b3))
- skip npm caching
  ([35b2d02](https://github.com/vicamo/gitea-actions-template/commit/35b2d02a4e055a2d2f53759d9a74fc186375d8f5))
- update contents in the dist dir
  ([4984069](https://github.com/vicamo/gitea-actions-template/commit/4984069f112b89b53eff21ac196523fcd68c3ddb))
- update dependabot.yml
  ([#262](https://github.com/vicamo/gitea-actions-template/issues/262))
  ([e9f4361](https://github.com/vicamo/gitea-actions-template/commit/e9f436162fc4cd535b06a062642d68420b887102))
- update project URLs
  ([c8e310b](https://github.com/vicamo/gitea-actions-template/commit/c8e310b173de3b433c3de5869cd623c610f356fe))

### 🧰 Documentation

- accommodate to Gitea Badge URLs
  ([cb934d9](https://github.com/vicamo/gitea-actions-template/commit/cb934d9c3c78984098256ec65ef5b54a984c00c6))
- add a customizing section for input/output parameters
  ([e761e8d](https://github.com/vicamo/gitea-actions-template/commit/e761e8de8b4682e0b8c2b5e0e1870e050a9a8868))
- add common README content
  ([1ab69ff](https://github.com/vicamo/gitea-actions-template/commit/1ab69ff6db48adf09991d6a5ad9db12d1711395b))
- complete README usage section with inputs info
  ([666c2c0](https://github.com/vicamo/gitea-actions-template/commit/666c2c04705d1c90dd3e8264417d54a30d775fc8))
- fix rendering of warning in README.md
  ([3cb2651](https://github.com/vicamo/gitea-actions-template/commit/3cb265137cf5bf0e5fad222b3ba29b4b8b7b491d))
- remove warning alert syntax
  ([d55e16c](https://github.com/vicamo/gitea-actions-template/commit/d55e16c91f783ede19466f1fc42df37aabcb8bf7))
- request developers to code with Node.js 16 or later
  ([c71c2a1](https://github.com/vicamo/gitea-actions-template/commit/c71c2a12df7e05de29524dc3bbe04dbf964f3474))
