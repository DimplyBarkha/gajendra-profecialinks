
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 60000,
    country: 'US',
    store: 'totalwine',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 35000;
    if (!url.includes('#[!opt!]')) {
      url = url + '#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~402:ifcStore~null@ifcStoreState~US-MD@method~INSTORE_PICKUP"}]}[/!opt!]';
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
      if (await context.evaluate(() => !!document.querySelector('img[src*="NotFoundPage"]'))) {
        throw new Error('Error: Whoops!, Sorry we’re coming up dry.');
      }
      await context.waitForSelector('#avg-rating-button').catch(err => { console.log('No rating found', err); });
    } else {
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    }
  },
};
