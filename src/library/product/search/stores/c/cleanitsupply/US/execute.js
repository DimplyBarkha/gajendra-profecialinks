
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cleanitsupply',
    domain: 'cleanitsupply.com',
    url: 'https://www.cleanitsupply.com/nsearch.aspx?keywords={searchTerms}&ip=60',
    loadedSelector: 'ul.small-block-grid-2.medium-block-grid-3.large-block-grid-4.text-center.item-grid li',
    noResultsXPath: '//span[contains(text()," Your search did not return an exact match.")]',
    zipcode: '',
  },
};
