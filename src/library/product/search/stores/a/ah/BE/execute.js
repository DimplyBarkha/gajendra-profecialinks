
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    domain: 'ah.be',
    url: 'https://www.ah.be/zoeken?query={searchTerms}',
    // noResultsXPath: 'boolean(div[@class="load-more_root__9MiHC"]/button) = 0',
    zipcode: '',
  },
};
