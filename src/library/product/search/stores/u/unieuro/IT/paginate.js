
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    nextLinkSelector: '#instant-results  div.listing-container  main  div.global-pagination  span.pagination-menu  span  div  span  ul  li:last-child a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: "//div[@id='no-results-message']/p",
    openSearchDefinition: null,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
