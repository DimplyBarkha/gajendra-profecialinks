module.exports = {
  parameters: [
    {
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
    },
    {
      name: 'timeout',
      description: 'Timeout for loading',
      type: 'number',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'The URL to go to',
      type: 'string',
    },
    {
      name: 'zipcode',
      description: 'Set location ',
      type: 'string',
    },
    {
      name: 'storeId',
      description: 'storeId for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
  },
  path: './goto/domains/${domain[0:2]}/${domain}',
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url);
    //await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
