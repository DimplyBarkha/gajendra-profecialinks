
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsCategory',
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
    openSearchDefinition: {
      template: 'https://www.amazon.co.uk/gp/bestsellers/*/{searchTerms}?_encoding=UTF8&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};
