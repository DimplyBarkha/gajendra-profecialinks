
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    domain: 'capitalhairandbeauty.co.uk',
    url: 'https://www.capitalhairandbeauty.co.uk/search-results?searchterm={searchTerms}&searchterm_submit=Go',
    loadedSelector: 'div.product-list',
    noResultsXPath: '//p[contains(text(),"No results found") and contains(@class,"error")]',
    zipcode: "''",
  },
};
