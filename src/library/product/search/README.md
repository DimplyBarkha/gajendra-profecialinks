# Creating a search implementation

Note if `www.` strip that off the domain.

```bash
import-io extractor:new --org <workbench org slug> --parameters country=<iso 2 country code, e.g. US> domain=<domain> store=<store name> --robot product/search
npm run lint:fix
```

See the new files created in VS Code.

You should not generally be writing code, everything is configuration driven. The code for a particular pattern is written once, and then the actions are set up with parameters.

There are of course exceptions, e.g. dealing with site specific block detection, where code will be necessary.

## Set the proxy configuration

The proxy zone needs to be set.

TODO: Need to confirm how this happens during editing.

Example:

```yaml
robot: product/search
parameters:
  country: GB
  domain: groceries.asda.com
  store: asda
proxy:
  zone: ZUK
  type: DATA_CENTER
```

## Edit the search execute action

Docs:

```js
/**
 *
 * @param { { keywords: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
```

The URL is a OpenSearch style pattern with a `{searchTerms}` placeholder.

Example:

```js
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
```

## Edit the pagination action

Docs:

```js
/**
 *
 * @param {{
 *  keywords: string,
 *  page: number,
 *  offset: number,
 * }} inputs
 * @param {{
 *  nextLinkSelector: string,
 *  mutationSelector: string,
 *  loadedSelector: string,
 *  spinnerSelector: string,
 *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number }
 * }} parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
 ```

#### `<link rel="next">`

This is supported out of the box, and you don't need any configuration.

### Next link/button

Supply a `mutationSelector` or `spinnerSelector` if it is in-page navigation or a `loadedSelector` if not in page but there is a need to wait.

Example:

```js
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GB',
    domain: 'groceries.asda.com',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    spinnerSelector: 'div.search-page-content div.asda-spinner',
  },
};

```

### URL Pattern

Note that you still shoudl use a loaded selector to detect the end of pagination.

```js

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    url: {
      indexOffset: 0,
      template: 'https://www.target.com/s?searchTerm={searchTerms}&Nao={startIndex}',
    },
    loadedSelector: 'div[data-test="productGridContainer"] li',
    domain: 'target.com',
  },
};
```

## Edit the extraction

### Copy of another one for the same store

```yaml
extends: ./base
```


### Single extraction

Just fill out the YAML generated with xpath/selector/regex.
