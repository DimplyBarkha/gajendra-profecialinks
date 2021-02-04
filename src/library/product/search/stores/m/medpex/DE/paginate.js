module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    nextLinkSelector: '#searchresult > div.pagenav > table > tbody > tr > td:nth-last-child(1)>a ',
    //nextLinkXpath: '//div[@class="pagenav"]//tr//td//a[contains(text(),">")]',
    mutationSelector: null,
    spinnerSelector: null,
    //noResultsXPath: '//div[@id="messageContainer"]/table[@class="error"]',
    loadedSelector: 'div[class="product-list-entry data-tracking-product"]',
    // openSearchDefinition: {
    //  template: 'https://www.medpex.de/search.do?q={searchTerms}&pn={page}',
    // },
    domain: 'medpex.de',
  },
};
