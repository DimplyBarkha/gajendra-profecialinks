module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    nextLinkSelector: 'li[class="sc-pagination-next"] > button[class="sc-btn"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="sc-image-wrapper"] > img',
    openSearchDefinition: null,
    noResultsXPath: '//div[@class="sc-error-page-title"]',
    domain: 'samsclub.com',
  },
};
