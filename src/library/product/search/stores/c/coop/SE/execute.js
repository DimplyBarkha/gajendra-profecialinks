
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'coop',
    domain: 'coop.se',
    url: 'https://www.coop.se/globalt-sok/?query={searchTerms}',
    loadedSelector: 'div.Grid-cell',
    noResultsXPath: '//h4[contains(.,"We did not really understand your search")]',
    zipcode: "''",
  },
};
