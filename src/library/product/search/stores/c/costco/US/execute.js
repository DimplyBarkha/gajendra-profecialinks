
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    url: 'https://www.costco.com/CatalogSearch?keyword={searchTerms}#[!opt!]{"cookie_jar":[{"name":"invCheckPostalCode","value":"98188"}]}[/!opt!]',
    loadedSelector: 'div.thumbnail p.description',
    noResultsXPath: '//div[@id="no-results"][contains(.,"Try Another Search")]',
  },
};
