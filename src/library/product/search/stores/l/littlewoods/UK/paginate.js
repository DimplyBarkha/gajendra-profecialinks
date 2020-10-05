
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul li a.paginationNext:not(.a-disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productImages a.productMainImage',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'littlewoods.com',
    zipcode: '',
  },
};
