
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'musgravemarketplace',
    domain: 'musgravemarketplace.ie',
    url: 'https://order.musgravemarketplace.ie/easyorder/infopr3?parm=8218640604502041964300&srchTrms=1&catSrchTrms={searchTerms}',
    loadedSelector: 'form#products-list th a img',
    noResultsXPath: '//h2[contains(text(), "Forbidden")]',
    zipcode: '',
  },
};
