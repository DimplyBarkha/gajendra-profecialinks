
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    nextLinkSelector: 'span[class*=paging-active]+a[class*=paging-number]',
    //nextLinkXPath:'//a[contains(@class,"selenium-WC-paging-next-button")]/@href', //'//a[contains(@class,"paging-next")]/@href',
    // mutationSelector: null,
    // spinnerSelector: 'div.search div.select3-selected-ietm',
    spinnerSelector: 'html.show-loading',
    loadedSelector: 'div#products',
    noResultsXPath: '//div[@id="empty-search"]',
    //openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.euro.com.pl/keyword={searchTerms},strona-{page}.bhtml',
    // },    
    domain: 'euro.com.pl',
    zipcode: '',
  },
};
