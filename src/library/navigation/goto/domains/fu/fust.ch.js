module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fust.ch',
    timeout: null,
    country: 'CH',
    store: 'fust',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    // let freshUrl;
    // let extractorType;
    // if (url.substring(23, 29) != 'search') {
    //   freshUrl = url.substring(16, url.length);
    //   extractorType = 'search';
    // } else {
    //   freshUrl = url;
    //   extractorType = 'core';
    // }
    await context.goto(url, {
      timeout: 250000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
