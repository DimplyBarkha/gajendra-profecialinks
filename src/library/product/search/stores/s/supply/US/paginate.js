
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'supply',
    nextLinkSelector: 'div[class="dib ph3 lh-solid f6"]+div',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="w-100 mb3 flex flex-column flex-row-l flex-wrap-l justify-between"]',
    noResultsXPath: '//div[@class="pr3 stymie large _1Wa5W"]',
    openSearchDefinition: null,
    domain: 'supply.com',
    zipcode: '',
  },
};
