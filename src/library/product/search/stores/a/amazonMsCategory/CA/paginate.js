module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsCategory',
    nextLinkSelector: 'ul.a-pagination>li.a-last:not(.a-disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "zeitgeist"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
    openSearchDefinition: {
      template: 'https://www.amazon.ca/gp/bestsellers/*/{searchTerms}?_encoding=UTF8&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.ca',
  },
};
