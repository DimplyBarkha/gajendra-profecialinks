async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (id) {
    url = await dependencies.createUrl({ id });
  } else if (!url) {
    throw new Error('no id provided');
  }
  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 60000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // Check for not found?
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
    store: 'noon',
    domain: 'noon.com',
    loadedSelector: 'div#content,div.swiper-container',
    noResultsXPath: '//p[contains(text(),"Uh-oh, something went wrong here")]',
    zipcode: '',
  },
  implementation,
};
