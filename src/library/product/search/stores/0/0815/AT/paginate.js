
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: '0815',
    nextLinkSelector: 'div[class="col-md-auto"]>nav>ul>li[class="page-item page-next"]>label>span[class*="icon icon-arrow-medium-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: '0815.at',
    zipcode: '',
  },
};
