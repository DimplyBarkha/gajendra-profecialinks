
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'newpharma',
    nextLinkSelector: null,
    nextLinkXpath: '(//td[@class="next"][contains(.,"Suiv")])[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product.js-product-row img',
    loadedXpath: null,
    noResultsXPath: '//span[@class="gtm-search-no-results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.newpharma.be/pharmacie/search-results/index.html?key1={searchTerms}&page={page}',
    },
    domain: 'newpharma.be',
    zipcode: "''",
  },
};
