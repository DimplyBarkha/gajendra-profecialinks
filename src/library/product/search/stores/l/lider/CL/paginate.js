
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'lider',
    nextLinkSelector: 'ul[class="pagination pull-right"]>li:nth-child(4)>a',
    // 'ul[class="pagination pull-right"]>li>a'
    // nextLinkXPath: "(//ul[@class='pagination pull-right']/li/a/@href)[3]"
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lider.cl',
    zipcode: '',
  },
};