
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    nextLinkSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="pager"]>div>ol>li[class="next"]>a',
    mutationSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="sorter"]>p[class="amount"]>font',
    spinnerSelector: null,
    loadedSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="pager"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'andorrafreemarket.com',
    zipcode: '',
  },
};
 