
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    loadedSelector: 'div.o-productdetail-v-2-titleb',
    noResultsXPath: '//div[contains(text(),"Die gesuchte Seite wurde leider nicht gefunden")]',
    zipcode: "''",
  },
};
