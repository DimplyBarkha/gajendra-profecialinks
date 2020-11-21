module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    nextLinkSelector: 'li.pagination-next a',
    // mutationSelector: null,
    // spinnerSelector: null,
    // loadedSelector: 'div[class="product__list--wrapper"]',
    loadedSelector: 'ul[class="product__listing product__grid"]',
    // ul[id="plp_display"]
    noResultsXPath: '//div[@class="not-found-text"]',
    // openSearchDefinition: {
    //   template: 'https://www.chedraui.com.mx/search?q={searchTerms}%3Arelevance&page={page}&pageSize=24', 
    //   //'https://www.chedraui.com.mx/search?text={searchTerms}&page={page-1}&pageSize={48}',
    // },
    domain: 'chedraui.com.mx',
    zipcode: "''",
  },
};
