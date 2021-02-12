
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    nextLinkSelector: null,
    // nextLinkXpath: '//*[@id="content-temp"]/div/div[3]/div[2]/div[4]/div/div/a[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@class="did-you-mean"]/p[@class="typo--07"]',
    stopConditionSelectorOrXpath: null,
    openSearchDefinition: {
      template: 'https://www.metro.ca/epicerie-en-ligne/recherche-page-{page}?&filter={searchTerms}',
    },
    domain: 'metro.ca',
    zipcode: '',
  },
};
