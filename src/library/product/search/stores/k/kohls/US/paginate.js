
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    nextLinkSelector: 'a.nextArw[style=""]',
    mutationSelector: null,
    spinnerSelector: 'div.pmp-ajax-loading1[style*="block"]',
    loadedSelector: 'ul.products',
    noResultsXPath: '//div[@class="frame_no_results"]',
    openSearchDefinition: null,
    domain: 'kohls.com',
    zipcode: '',
  },
};
