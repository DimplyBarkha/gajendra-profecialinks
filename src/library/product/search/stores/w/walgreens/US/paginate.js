module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    loadedSelector: 'div.product-container',
    resultsDivSelector: 'div.card__product',
    noResultsXPath: '//h1[contains(.,"have any matches")]',
    openSearchDefinition: {
      template: 'https://www.walgreens.com/search/results.jsp?Ntt={searchTerms}&No={index}',
      pageIndexMultiplier: 72,
      pageStartNb: 0,
    },
    domain: 'walgreens.com',
  },
};
