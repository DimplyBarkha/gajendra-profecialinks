
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'Sainsburys',
    domain: 'sainsburys.co.uk',
    loadedXpath: '//img[@class="pd__image"]/@srcset',
    noResultsXPath: null,
    zipcode: '',
  },
};
