
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'virginmegastore',
    domain: 'virginmegastore.sa',
    loadedSelector: 'div.swiper-slide.swiper-slide-active',
    noResultsXPath: '//h2[@class="search-empty__headline text-center"]',
    zipcode: '',
  },
};
