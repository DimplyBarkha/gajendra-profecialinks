
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const { zipcode, keywords } = inputs;
  const url = parameters.url;

  await dependencies.goto({ url, zipcode });

  await context.waitForSelector('iframe', { timeout: 7000 })
    .catch(() => console.log('No age verification needed!'));
  await context.evaluate(() => {
    const ageConfIframe = document.querySelector('iframe');
    if (ageConfIframe) {
      const dismissButton = ageConfIframe.contentDocument.querySelector('button[data-trigger="dismiss"]');
      if (dismissButton) {
        dismissButton.click();
      }
    }
  });

  await context.setInputValue('input#query', keywords);

  await context.clickAndWaitForNavigation('form[action="/search"] button[type="submit"]', { timeout: 15000, waitUntil: 'load' });

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
  implementation,
};
