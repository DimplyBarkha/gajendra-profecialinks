
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    mutationSelector: null,
    // nextLinkSelector: ('body > div.wrapper.container-fluid > main > div.catalogue-container > div.catalogue-product-section.col-lg-10.col-md-9 > nav > ul > li:nth-child(6) > a > span' or 'body > div.wrapper.container-fluid > main > div.catalogue-container > div.catalogue-product-section.col-lg-10.col-md-9 > nav > ul > li:nth-child(6) > a > span'),
    // nextLinkXpath: '//ul/li[@class="page-item"]/a[@class="page-link"]/following::li[1]/a/span',
    nextLinkXpath: '//ul/li[@class="page-item"][last()]/preceding::li[1]/a/span',
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.linio.com.pe/search?scroll=&q={searchTerms}&page={page}',
    // },
    domain: 'linio.com',
    zipcode: '',
  },
};
