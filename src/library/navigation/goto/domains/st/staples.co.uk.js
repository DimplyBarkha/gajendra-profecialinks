
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'staples.co.uk',
    timeout: 150000,
    country: 'UK',
    store: 'staples',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    // @ts-ignore
    // document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
    await context.goto(url, {
      block_ads: true,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
