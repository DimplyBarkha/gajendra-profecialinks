module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    nextLinkSelector: 'ul.pagination-select > li.next-prev > a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productQvContainer',
    noResultsXPath: '//div[@class="no-result-lt"]/h2',
    openSearchDefinition: null,
    domain: 'ulta.com',
    zipcode: '',
  },
};
