<p align="left">
    <img height=80 src="web/logo_github.png"/>
</p>

---

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat)](LICENSE)
[![Twitter](https://img.shields.io/badge/twitter-@straal-blue.svg?style=flat)](http://twitter.com/straal_)

# VuePressToGhostCMS

> Utility script to convert [VuePress](https://vuepress.vuejs.org/) markdowns to export file in [ghost](https://ghost.org/) format.

> The beginning of creating this script was to restore ghost posts from generated markdown files that were created using the script from the blog [Working With VuePress](https://ghost.org/docs/api/v3/vuepress/)

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [License](#license)

## Installation

Install npm packages

```shell
npm install
```

## Usage

Change variable `MARKDOWNS_DIRECTORY_PATH` to your directory with markdowns.

run command:

```bash
npm run generate
```

That will generate `export.json` file in root directory

## Support

Any suggestions or reports of technical issues are welcome! Contact us via [email](mailto:devteam@straal.com).

## License

This library is released under Apache License 2.0. See [LICENSE](LICENSE) for more info.