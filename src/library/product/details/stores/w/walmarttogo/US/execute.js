
const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;

  if (url && url.match(/[^\/]+$/)) {
    inputs.id = url.match(/[^\/]+$/)[0];
    builtUrl = await dependencies.createUrl(inputs);
  } else {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
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
    store: 'walmarttogo',
    domain: 'walmarttogo.api',
    loadedSelector: null,
    noResultsXPath: null,
  },
  implementation,
};
