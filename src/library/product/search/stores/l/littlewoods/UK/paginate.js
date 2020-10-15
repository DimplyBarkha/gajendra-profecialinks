
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    nextLinkSelector: '#main > div.viewOptions.viewOptionsFooter > div.pagination > ul > li:nth-child(4) > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#products>ul',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'littlewoods.com',
    zipcode: '',
  },
};
