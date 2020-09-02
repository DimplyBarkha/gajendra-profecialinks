
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    domain: 'galaxus.ch',
    url: 'https://www.galaxus.ch/Search?q={searchTerms}',
    loadedSelector: 'article.panelProduct a.styled__StyledLink-sc-5q25ol-0',
    noResultsXPath: "//h2[contains(@class, 'ZZ5g')] = 'Nothing found for'",
    zipcode: '',
  },
};
