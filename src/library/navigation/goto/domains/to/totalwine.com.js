module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 50000,
    zipcode: '95825',
    store: 'totalwine_95825',
    country: 'US',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    if (zipcode) {
      url = `${url}#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~1108:ifcStore~${zipcode}@ifcStoreState~US-CA@method~INSTORE_PICKUP"}]}[/!opt!]`;
    }
    await context.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 30000));
  },
};
