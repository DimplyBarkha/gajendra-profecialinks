async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ ...inputs, url: destinationUrl });
  const userLogin = 'promotions.tennents@tennents.com';
  const password = 'Supplierdemo1!';
  const windowLocation = await context.evaluate(async () => {
    return window.location.href;
  });
  if (windowLocation.includes('customerlogin')){
    await context.setInputValue('input#tbUsername', userLogin);
    await context.setInputValue('input#tbPassword', password);
    await context.click('a[class="customerloginbutton ajaxlogin NTButton ShowButton"]');
  }
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'tennents',
    domain: 'new.tennentsdirect.com',
    url: 'https://new.tennentsdirect.com/products/kw/{searchTerms}',
    loadedSelector: 'ul[class="row products"]',
    noResultsXPath: '//h1[@class="not-found"]',
    zipcode: '',
  },
  implementation,
};
