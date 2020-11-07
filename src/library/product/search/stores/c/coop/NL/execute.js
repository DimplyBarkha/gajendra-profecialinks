
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coop',
    domain: 'coop.nl',
    url: 'https://www.coop.nl/zoeken/?SearchTerm={searchTerms}',
    loadedSelector: 'article.listItem',
    noResultsXPath: '//div[contains(@class,"altHead") and contains(text(),"0 producten voor")]',
    zipcode: "''",
  },
};
