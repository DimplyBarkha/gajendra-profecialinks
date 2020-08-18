
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    loadedSelector: 'ul.swiper-wrapper li.swiper-slide',
    noResultsXPath: '//h1[@class="cms-title-text h1"]',
    zipcode: '',
  },
};
