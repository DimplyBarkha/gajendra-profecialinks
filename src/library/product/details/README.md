# Creating a details implementation

Note if `www.` strip that off the domain.

```bash
import-io extractor:new --org <workbench org slug> --parameters country=<iso 2 country code, e.g. US> domain=<domain> store=<store name> --robot product/details
npm run lint:fix
```

See the new files created in VS Code.

You should not generally be writing code, everything is configuration driven. The code for a particular pattern is written once, and then the actions are set up with parameters.

There are of course exceptions, e.g. dealing with site specific block detection, where code will be necessary.

## Set the proxy configuration

The proxy zone needs to be set.

Example:

```yaml
robot: product/details
parameters:
  country: GB
  domain: groceries.asda.com
  store: asda
proxy:
  zone: ZUK
  type: DATA_CENTER
```

## Execute action

At the moment this `execute` function just navigates to the product page. Could be extended to do other things (like check for not found, etc)

Example:

```js

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    domain: 'groceries.asda.com',
  },
};
```

## Edit the createUrl action if needed

This is for cases where you have an `id` or unique identifier for product (could be SKU, etc) but not url. 

By default this implementation is

```js
  const { id } = inputs;
  const { domain, prefix } = parameters;
  return `https://${domain}/${prefix}/${id}`; 
```

Configure this default implementation if you wish to use it, otherwise a custom implementation will be needed.

Example:

```js

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'groceries.asda.com',
    prefix: 'search',
    country: 'UK',
    store: 'asda',
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


# Creating this robot

**Version** ^0.1.0

#### Create Schema

```shell
import-io schema:new product/details
```

#### Create entry js file

```shell
import-io action:new --parameters store country --inputs url --path product/details/action
```

#### Create execute function (any actions which need to be performed)

```shell
import-io action:new --parameters store country domain --inputs url --path product/details/execute
```

#### Create createUrl function
```shell
import-io action:new --parameters domain prefix --inputs id --path product/details/createUrl
```

#### Create extraction function (prepare data on page)

```shell
import-io action:new --parameters store country store domain --path product/details/extract
```

#### Make robot from entry point

```shell
import-io robot:new --schema product/details --parameters domain country store --entryPoint product/details/action --path product/details
```
