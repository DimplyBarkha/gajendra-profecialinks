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
    // await context.setBlockAds(false);
    // await context.setFirstRequestTimeout(50000);
    // await context.setBypassCSP(true);
    // await context.setAntiFingerprint(false);
    // await context.setLoadAllResources(true);
    // await context.setUseRelayProxy(false);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);

    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;

    await dependencies.goto({ url, zipcode, storeId });

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
