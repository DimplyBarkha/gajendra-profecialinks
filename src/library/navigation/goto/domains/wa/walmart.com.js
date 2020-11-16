module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 20000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const datetime = new Date().getTime();
    url = `${url}#[!opt!]{"cookie_jar":[{"name":"t-loc-psid","value":"${datetime}|${storeId}"}]}[/!opt!]`;
    console.log(url);
    console.log('###############################################');
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
