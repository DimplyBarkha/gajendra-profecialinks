
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    domain: 'melectronics.ch',
    url: 'https://www.melectronics.ch/de/s?q={searchTerms}',
    loadedSelector: 'div.p-product-listing--item.p-product-listing--item__content.col-md-9.col-sm-12',
    noResultsXPath: '//*[@class="wysiwyg"]/div/h2/font/font[1]',
    zipcode: '',
  },
};
