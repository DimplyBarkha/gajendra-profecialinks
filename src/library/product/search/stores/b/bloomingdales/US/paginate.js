
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    nextLinkSelector: null,
    // 'li.paginateArrow.nextArrow a.action-btn',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="sortableGrid"]',
    noResultsXPath: '//div[@class="zeroResultsSearchMessage"]',
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   templete: 'https://www.bloomingdales.com/shop/search/Pageindex/{page}?keyword={searchTerms}',
    // },
    domain: 'bloomingdales.com',
    zipcode: '',
  },
};
