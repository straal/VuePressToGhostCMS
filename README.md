<p align="left">
    <img height=80 src="web/logo_github.png"/>
</p>

---

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat)](LICENSE)
[![Twitter](https://img.shields.io/badge/twitter-@straal-blue.svg?style=flat)](http://twitter.com/straal_)

# VuePressToGhostCMS

> Utility to convert [VuePress](https://vuepress.vuejs.org/) Markdown files to a dump file in [ghost](https://ghost.org/) format.

> The solution is inspired by [Working With VuePress article](https://ghost.org/docs/api/v3/vuepress/) and provides the reverse conversion to export `*.md` files into *Ghost CMS* backup file.

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [License](#license)

## Installation

Install npm packages:

```shell
npm install
```

## Usage

Open `src/convertMDToGhostBackup.js` file and set variable `MARKDOWN_DIRECTORY_PATH` to the directory with your Markdown pages

Use the following command to generate the output *export.json* file:

```bash
npm run generate
```

## Support

Any suggestions or reports of technical issues are welcome! Contact us via [email](mailto:devteam@straal.com).

## License

This library is released under Apache License 2.0. See [LICENSE](LICENSE) for more info.
