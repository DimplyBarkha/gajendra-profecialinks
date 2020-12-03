
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url;
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  await context.waitForSelector('div.age-barrier-wrapper div.buttons', { timeout: 10000 })
    .then(async () => {
      await context.evaluate(() => {
        const confirmButton = document.evaluate("//a[contains(text(),'21+')]", document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        confirmButton.click();
      });
    })
    .catch(() => console.log('No age verification needed!'));

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    domain: 'logicvapes.us',
    url: 'https://www.logicvapes.us/shop',
    loadedSelector: 'div.products-list-category',
    noResultsXPath: '//p[contains(text(),"page you are looking for doesn\'t exist")]',
    zipcode: '',
  },
  implementation,
};
