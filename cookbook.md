Goal: Demo creating a Search extractor for safeway.com using the Extractor SDK.

The Extractor SDK will scaffold the required files and directory structure. 
The files will need to  be updated to match the site you are extracting from.  

In this scenario we will:

1. Search for a product using this Url example:

*https://www.safeway.com/shop/search-results.html?q=soap&zipcode=94611*
    
2. Paginate
3. Extract data 

# Create extractor scaffolding
Install the SDK for you system from https://github.com/import-io/import-io-cli-public

Execute this command to create the structure for your new extractor.

```
import-io extractor:new --org mjgp2 --parameters country=US domain=safeway.com store=safeway --robot product/search
```

# This creates the following files for your new extractor.


## Modify *src/library/product/search/stores/s/safeway/US/execute.js*
These are site specific selectors and url patterns
```
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    domain: 'safeway.com',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}&zipcode=94611',
    loadedSelector: '#search-grid_0 > div:nth-child(1) > product-item > div',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
};
```

## Modify *src/library/product/search/stores/s/safeway/US/extract.js* 
Note: Input Transforms would go here if needed.

```
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    domain: 'safeway.com',
  },
};
```

## Update *src/library/product/search/stores/s/safeway/US/paginate.js*
This is where you define selectors for pagination.
```
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    nextLinkSelector: '#search-grid_0 > div.col-xs-12.col-sm-12.col-md-12.bloom-load-wrapper > button',
    domain: 'safeway.com',
  },
};
```

## Update *src/orgs/mjgp2/product/s/safeway/US/search/inputs.yaml*
```
exampleInput:
  keywords: soap
```


## Update *src/orgs/mjgp2/product/s/safeway/US/search/extractor.yaml*
```
robot: product/search
parameters:
  country: US
  domain: safeway.com
  store: safeway
  - name: title
    singleValue: true
    description: The product title
    example: Wonder Bread
    selector: a.product-title

```


## No modifications made to these files for this example
```
src/library/product/search/stores/s/safeway/US/extract.yaml
src/library/navigation/domains/sa/safeway.com.js
src/library/product/search/stores/s/safeway/US/search.js
```

## Run your extractor
```
import-io action:run:local --parameters country=US domain=safeway.com store=safeway --action product/search --inputs keywords=milk
```

