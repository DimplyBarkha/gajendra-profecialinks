
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    domain: 'casinodrive.fr',
    url: 'https://www.casino.fr/ecommerce/z_catalog/rechercheNormaleResultat/(layout=7.01-14_2_12_121_13_29_14_8&uiarea=0)/.do?query={searchTerms}',
    loadedSelector: 'div[class="lazyload"] ul[class*="prodlist"]',
    noResultsXPath: '//span[@class="msg-design sorry big "]',
    zipcode: '',
  },
};
