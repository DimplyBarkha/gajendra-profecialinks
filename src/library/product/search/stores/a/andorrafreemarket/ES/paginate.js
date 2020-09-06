
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    nextLinkSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="pager"]>div>ol>li[class="next"]',
    mutationSelector: 'div[class="category-products"]>div[class="toolbar"]>div[class="sorter"]>p[class="amount"]',
    spinnerSelector: null,
    loadedSelector: 'div[class="category-products"]',
    noResultsXPath: '//div[contains(@class, "main-container")]//div[contains(@class, "col-main")]//div[@class="page-title"]//h1[contains(text(), "Resultados")]',
    openSearchDefinition: null,
    domain: 'andorrafreemarket.com',
    zipcode: '',
  },
};
