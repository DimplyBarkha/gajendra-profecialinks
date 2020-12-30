
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]={searchTerms}',
    // loadedSelector: 'section[class="ln-o-section ln-o-section"] ul[class="ln-o-grid ln-o-grid--matrix ln-o-grid--equal-height"] li[class="pt-grid-item ln-o-grid__item ln-u-6/12@xs ln-u-3/12@md ln-u-2/12@xl"]',
    noResultsXPath: '(//div[contains(@class,"si__no-results")])[1]',
    zipcode: '',
  },
};



