
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'footlocker',
    nextLinkSelector: '#main > div > div.Page-body.constrained > div > section > div > div.SearchResults > nav > ul > li.col.Pagination-option.Pagination-option--next.col-shrink:not(.a-disabled) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'footlocker.com',
    zipcode: '',
  },
};
