
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    domain: 'amazon.com.tr',
    url: 'https://www.amazon.com.tr/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin], section.ebx-empathy-x__body',
    noResultsXPath: '//span[contains(text(),"sonuç yok")]',
    zipcode: '',
  },
};
