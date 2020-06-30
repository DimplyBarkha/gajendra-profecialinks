
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'Amazonprimepantry_45202',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'amazon.com',
    zipcode: '45202',
  },
};
