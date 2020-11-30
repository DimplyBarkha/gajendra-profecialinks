// const { implementation } = require('../../../../../search/stores/e/electrictobacconist/sharedExecute');
async function implementation(
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

  await context.waitForSelector('iframe', { timeout: 7000 })
    .catch(() => console.log('No age verification needed!'));
  await context.evaluate(() => {
    // multiple iframes on details page, need better selector for age ver one
    const ageConfIframe = document.querySelector('iframe');
    if (ageConfIframe) {
      const dismissButton = ageConfIframe.contentDocument.querySelector('button[data-trigger="dismiss"]');
      if (dismissButton) {
        dismissButton.click();
      }
    }
  });

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
    store: 'electrictobacconist',
    domain: 'electrictobacconist.com',
    loadedSelector: 'div[class*="product-page-wrapper"]',
    noResultsXPath: '//h1[contains(text(),"page isn\'t available")] | //div[@class="not-found-search"]',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
  implementation,
};
