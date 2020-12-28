module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
      country: 'GLOBAL',
      store: 'amazonMsCategory',
      nextLinkSelector: null,
      mutationSelector: null,
      spinnerSelector: null,
      loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
      noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
      openSearchDefinition: {
        template: 'https://www.amazon.com/gp/bestsellers/*/{searchTerms}?pg={page}',
      },
      domain: 'amazon.com',
    },
  };