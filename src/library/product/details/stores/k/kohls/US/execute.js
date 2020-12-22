const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  let { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }

  url = `${url}#[!opt!]{"cookies":[]}[/!opt!]`;

  await dependencies.goto({ ...inputs, url: builtUrl || url });

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
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    loadedSelector: 'div[id="PDP_colGrid"]',
    noResultsXPath: '//div[@class="pdp_outofstockproduct"] | //div[@class="frame_no_results"]',
    zipcode: '',
  },
  implementation,
};
