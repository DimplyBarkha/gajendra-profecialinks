async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId, id });

  if (id) {
    const firstItemUrl = await context.evaluate(() => {
      const firstItem = document.querySelector('li.item.first.btn_line a');
      return firstItem.getAttribute('href');
    });
    await context.goto(firstItemUrl, { timeout: 30000, waitUntil: 'load' });
  }

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
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    domain: 'mumzworld.com',
    loadedSelector: 'img#image',
    noResultsXPath: '//img[@class="valignmid"]',
    zipcode: '',
  },
  implementation,
};
