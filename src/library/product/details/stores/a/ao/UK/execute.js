
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    loadedSelector: '#container',
    noResultsXPath: '//h1[@class="break-words mb-4 mt-6 text-center text-display font-regular"]/text()',
    zipcode: '',
  },
};
