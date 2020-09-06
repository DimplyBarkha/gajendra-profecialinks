
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    nextLinkSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="pager"]>div>ol>li[class="next"] a.next',
    mutationSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="sorter"]>p[class="amount"]',
    spinnerSelector: null,
    loadedSelector: 'div[class="category-products"]',
    noResultsXPath: '//p[contains(@class,"empty-catalog")]',
    openSearchDefinition: null,
    domain: 'andorrafreemarket.com',
    zipcode: '',
  },
};
