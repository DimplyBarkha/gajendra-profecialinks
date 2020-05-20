# Creating a search robot

```bash
import-io extractor:new --org <workbench org slug> --parameters country=UK domain=groceries.asda.com store=asda --robot product/search
npm run lint:fix
```

See the new files created in VS Code.

## Set the proxy configuration

The proxy zone needs to be set.

TODO: Need to confirm how this happens during editing.

Example:

```yaml
robot: product/search
parameters:
  country: UK
  domain: groceries.asda.com
  store: asda
proxy:
  zone: ZUK
  type: DATA_CENTER
```

## Edit the search execute action

Example:

```js
module.exports = {
  implements: 'product/search/execute',
  parameterValues: { country: 'UK', domain: 'groceries.asda.com', store: 'asda' },
  implementation: async ({ keywords }, { country, store }, context, { goto }) => {
    const url = `https://groceries.asda.com/search/${encodeURIComponent(keywords)}/products`;
    await goto({ url });
    await context.waitForSelector('div.co-product');
  }
};
```

## Edit the pagination action

### Next link/button

Supply a `mutationSelector` if it is in-page navigation.

Example:

```js
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    mutationSelector: 'div.co-product-list',
  },
};
```

## Edit the extraction

### Copy of another one for the same store

```yaml
extends: ./base
```

### Single extraction

Just fill out the YAML generated with xpath/selector/regex.