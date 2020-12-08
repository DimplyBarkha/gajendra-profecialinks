
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    nextLinkSelector: 'li.bv-content-pagination-buttons-item-next a',
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
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  await context.waitForSelector('div.visible');
  // if(nextLinkSelector) {
  //   await context.click(nextLinkSelector);
  // }

  // @ts-ignore
  await context.evaluate(async function () {
    var next = document.querySelector('li.bv-content-pagination-buttons-item-next a');
    if(next) {
     // @ts-ignore
     next.click();
     console.log('clicked');
    }
   });
 
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
  
  
}