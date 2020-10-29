
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    nextLinkSelector: 'div.pagination>a.next',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: '.listView>ul',
    // noResultsXPath: null,
    // openSearchDefinition: null,
    domain: 'n11.com',
    zipcode: '',
  },
};
