
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'haarbedarf',
    domain: 'haarbedarf.at',
    url: 'https://haarbedarf.at/?s="{searchTerms}"&post_type=product&title=1',
    loadedSelector: 'html body',
    noResultsXPath: '//p[contains(@class, "woocommerce-info")]',
    zipcode: '',
  },
};
