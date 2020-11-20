
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'empik',
    nextLinkSelector: 'div.pagination a.arrow.next.ta-next-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productWrapper a.img img.lazy',
    noResultsXPath: '//div[@class="sort notFound"]',
    openSearchDefinition: null,
    domain: 'empik.com',
    zipcode: '',
  },
};
