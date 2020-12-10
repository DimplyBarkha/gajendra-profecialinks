
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'kroger',
    nextLinkSelector: 'a.bv-content-btn.bv-content-btn-pages.bv-content-btn-pages-last.bv-focusable.bv-content-btn-pages-active',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.bv-mbox-spinner',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@id="notFound"] | //h2[contains(text(),"to have a bad link")] | //div[contains(@data-bv-show,"reviews") and (@class="hidden")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'kroger.com',
    zipcode: '',
  },
};
