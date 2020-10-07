
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    domain: 'footlocker.co.uk',
    loadedSelector: '#slick-slide00 img',
    noResultsXPath: '//*[@class="fl-downtime-page--headline"]',
    zipcode: '',
  },
};
