
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'shopmylocal',
    nextLinkSelector: '[aria-label="Pagination"] > [class="next_page btn"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//a[contains(@class,"AdvertTile-imageBoxContainer")]/div[contains(@class,"AdvertTile-imageBox")]/@style',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'shopmylocal.com.au',
    zipcode: '2075'
  },
};
