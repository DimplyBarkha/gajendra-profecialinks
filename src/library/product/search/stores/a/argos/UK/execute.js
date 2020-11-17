
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  await context.goto(parameters.url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  await context.waitForSelector('#app-content');
  // Check if cookies pop-up appeared
  const doesPopupExist = await context.evaluate(function () {
    return Boolean(document.querySelector('button[id="consent_prompt_submit"]'));
  });

  if (doesPopupExist) {
    await context.click('button[id="consent_prompt_submit"]');
  }

  try {
    await context.setInputValue('#searchTerm', inputs.keywords);
  } catch (err) {
    console.log('Set input value, error - ' + err);
  }

  try {
    await context.clickAndWaitForNavigation('form > button[type="submit"]', {}, { timeout: 50000 });
  } catch (err) {
    console.log('Click & Navigation error' + err);
  }

  try {
    await context.waitForSelector('div[class*="text-wrapper"]>a[title="Shop all Dyson."]', { timeout: 30000 });
    await context.click('div[class*="text-wrapper"]>a[title="Shop all Dyson."]');
    await context.waitForNavigation({ timeout: 30000 });
    console.log('clicked the button successfully');
  } catch (e) {
    console.log('not able to click the button');
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 30000 }, parameters.loadedSelector, parameters.noResultsXPath);
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
    country: 'UK',
    store: 'argos',
    domain: 'argos.co.uk',
    url: 'https://www.argos.co.uk/',
    loadedSelector: '#findability > div > div.search > div',
    noResultsXPath: '//h2[contains(@data-test,"no-results-suggestions-heading")]',
  },
  implementation,
};
