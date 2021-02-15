async function implementation (inputs, { loadedSelector, noResultsXPath }, context, dependencies) {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 30000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    domain: 'fnac.com',
    loadedSelector: 'div[class~="f-productVisuals-mainIconZoom"]',
    noResultsXPath: '//p[contains(@class,"firstline")]|//body[contains(@class, "home-page")]//div[contains(@class, "Main")]',
    zipcode: '',
  },
  implementation,
};
