# 🤖 Robot Library

TODO: CLI command for `(cat ../import-io-cli/lib/context/icontext.d.ts; echo export as namespace ImportIO;) > types/globals.d.ts`


---

### Robots

#### Product
* [search](src/library/product/search)
* [details](src/library/product/details)

---

### Prerequisites
* Knowledge of git
* Node
* CLI and Desktop tools installed
* Import.io API Key



### Getting started

Clone down this repository and run 

```shell
npm install
```

1. Download [CLI](https://import-io.github.io/import-io-cli-public/#cli) and [Desktop App](https://import-io.github.io/import-io-cli-public/#desktop-app)
2. Familiarize yourself with the [CLI tool](https://import-io.github.io/import-io-cli-public/). 
3. Know the [core concepts](https://import-io.github.io/import-io-cli-public/#concepts)
4. Make sure you understand the [context](https://import-io.github.io/import-io-cli-public/interfaces/icontext.html) API
5. Run through the example in the documentation


### Development flow

#### Creating a New "robot" template
When starting to develop a new robot it is important to have your inputs, output schema, and entry points well defined. What will be your parameters and reusable functions?

Refer to [this section of the docs](https://import-io.github.io/import-io-cli-public/#setting-up-a-new-extractor-template) for more on setting up robot templates


#### Implementing an extractor/robot

1. Make sure you're familiar with [this section](https://import-io.github.io/import-io-cli-public/#for-extractor-implementors) of the cli documentation
2. Check out a branch with the name `<domain>-<robot>`
3. Fill out the scaffolded files with the necessary implementation details (be sure to delete any `implementation` functions if you wish to use the default implementations)
4. Test your extractor locally using `action:run:local` to view the playback on your local browser and `action:run:remote` to make sure it will work at runtime
5. [Deploy a dev version](https://import-io.github.io/import-io-cli-public/#deploy-a-dev-version-of-the-extractors-to-the-platform) of your extractor. You can provide `-a` or `--account` to deploy it to your personal account.
6. Push up your branch and open a Pull Request for review


#### Code Review
Before your code can be merged it must go through a thorough peer review and pass the CI build (to be implemented)

Here are some things to look for:
* [DRY and KISS](https://dzone.com/articles/software-design-principles-dry-and-kiss); If something needs to be written twice it probably needs to be written as a reusable dependency
* Does the code adhere to the current style? Does it pass the lint? (todo)
* Commented out code should be removed
* Use default implementations as much as possible. If you find yourself writing the same logic in two custom implemenations perhaps the default implementation should be updated


