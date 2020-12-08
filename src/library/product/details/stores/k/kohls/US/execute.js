module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    loadedSelector: 'div[id="PDP_colGrid"]',
    noResultsXPath: '//div[@class="pdp_outofstockproduct"]',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    let { url, id, zipcode, storeId } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }

    url = `${url}#[!opt!]{"cookies":[]}[/!opt!]`;

    await dependencies.goto({ url, zipcode, storeId });

    await new Promise((resolve, reject) => setTimeout(resolve, 5000));

    if (parameters.loadedSelector) {
      await context.waitForFunction(
        function (sel, xp) {
          return Boolean(
            document.querySelector(sel) ||
              document
                .evaluate(
                  xp,
                  document,
                  null,
                  XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
                  null)
                .iterateNext());
        },
        { timeout: 20000 },
        parameters.loadedSelector,
        parameters.noResultsXPath);
    }
  },
};
