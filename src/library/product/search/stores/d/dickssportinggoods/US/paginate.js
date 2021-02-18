
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'dickssportinggoods',
    nextLinkSelector: 'div.rs_card_container > div.rs_product_card_container.dsg-flex.flex-wrap > div.rs-bottom-pagination > div > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: ' div.rs_card_container > div.rs_product_card_container.dsg-flex.flex-wrap',
    loadedXpath: null,
    noResultsXPath: '//div[@class="rs-not-found-result-string"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'dickssportinggoods.com',
    zipcode: '',
  },
};
