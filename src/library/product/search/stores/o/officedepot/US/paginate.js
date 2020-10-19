
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    nextLinkSelector: '#paginationFooter > div.next.pg_btn > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#productView',
    noResultsXPath: '//div[@class="h3 brandColor_tp2 section no_result_break"]',
    openSearchDefinition: null,
    domain: 'officedepot.com',
    zipcode: '',
  },
};