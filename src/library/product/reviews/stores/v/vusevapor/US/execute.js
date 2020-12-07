async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let url;
  if (inputs.url) {
    url = inputs.url;
  } else if (parameters.reviewUrl && inputs.id) {
    url = parameters.reviewUrl.replace(/{id}/g, inputs.id);
  }
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  if (parameters.sortButtonSelector) {
    const selectors = parameters.sortButtonSelector.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  await context.click('li#tab-label-reviews')
    .then(async () => {
      await context.waitForSelector('li[class="item review-item"]', { timeout: 7000 });
    })
    .catch(() => console.log('No reviews for item!'));

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
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    domain: 'vusevapor.com',
    loadedSelector: 'div.product-info-main',
    noResultsXPath: '//div[@class="missing-page"] | //h2[contains(text(),"Sorry, that page has gone")]',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
  implementation,
};
