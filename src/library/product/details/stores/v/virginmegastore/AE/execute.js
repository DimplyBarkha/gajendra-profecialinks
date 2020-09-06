
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'virginmegastore',
    domain: 'virginmegastore.ae',
    loadedSelector: 'div.swiper-slide.swiper-slide-active',
    noResultsXPath: '//h2[@class="search-empty__headline text-center"]',
    zipcode: '',
  },
};
