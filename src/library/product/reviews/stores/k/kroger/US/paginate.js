
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'kroger',
    nextLinkSelector: null,
    nextLinkXpath: '//span[@class="bv-content-btn-pages-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@id="notFound"] | //h2[contains(text(),"to have a bad link")] | //div[contains(@data-bv-show,"reviews") and (@class="hidden")]',
    stopConditionSelectorOrXpath: '//span[@class="bv-content-btn-pages-next"]//parent::button/@disabled',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'kroger.com',
    zipcode: '',
  },
};
