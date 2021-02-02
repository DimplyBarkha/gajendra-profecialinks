
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KO',
    store: 'auction',
    domain: 'auction.co.kr',
    url: 'http://browse.auction.co.kr/search?keyword={searchTerms}&itemno=&nickname=&frm=hometab&dom=auction&isSuggestion=No&retry=&Fwk={searchTerms}&acode=SRP_SU_0100&arraycategory=&encKeyword={searchTerms}',
    loadedSelector: 'div#section--inner_content_body_container',
    noResultsXPath: null,
    zipcode: '',
  },
};
