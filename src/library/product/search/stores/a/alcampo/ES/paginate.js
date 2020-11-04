
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    nextLinkSelector: null, // 'div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.span-20.last.slideGridDiv3',
    noResultsXPath: '//div[@class="span-24"]',
    openSearchDefinition: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
};
