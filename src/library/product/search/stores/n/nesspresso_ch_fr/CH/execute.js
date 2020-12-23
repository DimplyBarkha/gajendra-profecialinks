
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_fr',
    domain: 'nespresso.com',
    url: 'https://www.nespresso.com/ch/fr/order/accessories/original#collections={searchTerms}',
    loadedSelector: 'div[class=ProductListGroup]',
    noResultsXPath: '//h2[contains(.,"0 ACCESSOIRES")]',
    zipcode: '',
  },
};
