
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    nextLinkSelector: 'a[tabindex="0"] img[class="nxtPage"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="productInfo productGallery "]',
    noResultsXPath: '//div[@class="monetate_selectorHTML_bcb1faba"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'qvc.com',
    zipcode: '',
  },
};
