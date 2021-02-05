
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boulanger.com',
    timeout: null,
    country: 'FR',
    store: 'boulanger',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.setBlockAds(false);
    // await context.goto(url, { timeout: 90000, waitUntil: 'networkidle0', block_ads: false });
    const isBlocked = async () => {
      return await context.evaluate(async function () {
        const errorXpath = document.evaluate("//title[contains(text(), 'Error')] | //title[contains(text(), 'Access Denied')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (errorXpath.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };
    const promise2 = async () => {
      await new Promise(resolve => setTimeout(resolve, 30000));
      if (await isBlocked() === 'true') {
        return await context.reportBlocked();
      }
    };
    Promise.all([context.goto(url, { timeout: 90000, waitUntil: 'networkidle0', block_ads: false }), promise2]);
  },
};
