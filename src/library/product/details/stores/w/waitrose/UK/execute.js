
const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  const detailsPage = await context.evaluate(async () => {
    if (document.querySelector('div[id="introAgreeButton"] span[class="CwaK9"] span[class="RveJvd snByac"]') !== null) {
      document.querySelector('div[id="introAgreeButton"] span[class="CwaK9"] span[class="RveJvd snByac"]').click();
    }
    if (document.querySelector('div[class="bErdLd aID8W wwYr3"]') !== null && document.querySelector('div[class="t7xA6 m114nf aID8W"]') !== null) {
      document.querySelector('div[class="bErdLd aID8W wwYr3"]').remove();
      document.querySelector('div[class="t7xA6 m114nf aID8W"]').remove();
    }
    if (document.querySelector('div[class="yuRUbf"] a') !== null) {
      return document.querySelector('div[class="yuRUbf"] a').getAttribute('href');
    }
  });
  if (detailsPage) {
    await context.goto(detailsPage);
    await context.waitForNavigation();
  }
  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"], a[data-origincomponent="ProductPod"]',
    noResultsXPath: '//button[@aria-label="Load more"] | //div[@class="noResults___2M4HP"] | //h1[contains(text(), "404 Not Found")] | //ul[@style="margin-left:1.3em;margin-bottom:2em"]',
    zipcode: '',
  },
  implementation,
};
