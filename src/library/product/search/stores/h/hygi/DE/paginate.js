
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'hygi',
    // nextLinkSelector: 'a[class="Next"]',
    nextLinkXpath: '(//a[@class="Next"])[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   pageStartNb: 1,
    //   template: 'https://www.lyreco.com/webshop/DEDE/search/page/{page}',
    //   },
    domain: 'hygi.de',
    zipcode: '',
  },
};
