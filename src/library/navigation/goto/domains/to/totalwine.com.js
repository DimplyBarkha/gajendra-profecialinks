
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    country: 'US',
    store: 'totalwine',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~402:ifcStore~null@ifcStoreState~US-MD@method~INSTORE_PICKUP"}]}[/!opt!]`;
    await context.goto(url);
    if (await context.evaluate(() => !!document.querySelector('img[src*="NotFoundPage"]'))) {
      throw new Error('Error: Whoops!, Sorry we’re coming up dry.');
    }
  },
};
