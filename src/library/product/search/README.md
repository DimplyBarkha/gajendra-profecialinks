# Creating a search implementation

Note if `www.` strip that off the domain.

```bash
import-io extractor:new --org <workbench org slug> --parameters country=<iso 2 country code, e.g. US> domain=<domain> store=<store name> --robot product/search
npm run lint:fix
```

See the new files created in VS Code.

* Make sheet to track what is to be built


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

If you are waiting for something on the page to have loaded, ensure you also give the option of waiting for both the 
"results" state and the "no results" state, either by xpath (text contains) or selector.

Example:

```js
module.exports = {
  implements: 'product/search/execute',
  parameterValues: { country: 'GB', domain: 'groceries.asda.com', store: 'asda' },
  implementation: async ({ keywords }, { country, store }, context, { goto }) => {
    const url = `https://groceries.asda.com/search/${encodeURIComponent(keywords)}/products`;
    await goto({ url });
    await context.waitForSelector('div.co-product, #listingsContainer');
  }
};
```

## Edit the pagination action

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
    spinnerSelector: 'div.asda-spinner',
  },
};
```

This is the simplest case - no code necessary.

## Edit the extraction

### Copy of another one for the same store

```yaml
extends: ./base
```


### Single extraction

Just fill out the YAML generated with xpath/selector/regex.
