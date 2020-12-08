
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    // nextLinkSelector: 'li.bv-content-pagination-buttons-item-next a',
    nextLinkXpath:'//li[contains(@class,"bv-content-pagination-buttons-item-next")]/a',
    loadedSelector: 'div.visible',
    domain: 'bebitus.com',
    // noResultsXPath: '//button[contains(@class,"bv-content-btn-pages-inactive")]'
  },
  implementation
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkXpath, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;
  await context.evaluate(async function () {
    var totalReview = document.querySelectorAll('ol.bv-content-list.bv-content-list-reviews li.bv-content-item.bv-content-top-review.bv-content-review').length;
    console.log('totalReview');
    console.log(totalReview);
 });
 

  if (nextLinkXpath) {
    // await context.waitForSelector('div.visible');
    const hasNextLink =  await context.evaluate(async function () {
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    
    var next = document.querySelector('li.bv-content-pagination-buttons-item-next a');
    if (!next) return false;
    // @ts-ignore
    next.click();
    await  timeout(5000)
    return true;
    }, { selector: nextLinkXpath });
    if (!hasNextLink) return false;
    }














  // if(nextLinkSelector) {
  //   await context.click(nextLinkSelector);
  // }

  // @ts-ignore
  // await context.evaluate(async function () {
  //   var next = document.querySelector('li.bv-content-pagination-buttons-item-next a');
  //   if(next) {
  //    // @ts-ignore
  //    next.click();
  //    console.log('clicked');
  //   }
  //  });
 
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
  
  
}