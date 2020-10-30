
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    nextLinkSelector: 'a[data-selenium="listingPagingPageNext"] svg[class="bhIcon "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-selenium="miniProductPage"]',
    noResultsXPath: '//h1[@class="title_2Tkgx8jFMHLoxqcKbZDI7v"]',
    openSearchDefinition: null,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
};
