
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'aptekagemini.pl',
    timeout: 500000,
    country: 'PL',
    store: 'aptekagemini',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(URL, { timeout: timeout, waitUntil: 'networkidle0' });
    try {
      await context.waitForSelector('div[class="vue-modal__content"]');
      await context.click('button[class*="button vue-privacy"]');
      console.log('cookies box clicked successfully');
    } catch (e) {
      console.log('No cookie box');
    }
  },
};
