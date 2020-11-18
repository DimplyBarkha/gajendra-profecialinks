
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    nextLinkSelector: 'div.p-wrapper > div#p-items > div.dynpg > table.pgbc > tbody td.next > a.enabled',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.p-box',
    noResultsXPath: '//span[contains(text(), 0)]',
    // openSearchDefinition: {
    //   template: 'http://www.ebaystores.com.au/dyson-australia/_i.html?rt=nc&_nkw={searchTerms}&_sid=1630776705&_trksid=p4634.c0.m14.l1581&_pgn={page}&ItemPerPage=30',
    // },
    domain: 'ebay.com.au',
    zipcode: '',
  },
};
