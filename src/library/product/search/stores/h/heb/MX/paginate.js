
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    //nextLinkSelector: 'li[class="item pages-item-next"] a[class="action next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="message info empty"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      //pageStartNb: 1,
      template: 'https://www.heb.com.mx/catalogsearch/result/index/?p={page}&q={searchTerms}',
      },
    domain: 'heb.com',
    zipcode: '',
  },
};