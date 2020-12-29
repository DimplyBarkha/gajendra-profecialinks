module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.com',
    timeout: 300000,
    country: 'US',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    await context.goto(`${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"discard_CSP_header":true,"force200": true}[/!opt!]`, { timeout, waitUntil: 'load', checkBlocked: true });
    const newUrl = await context.evaluate(function (url) {
      const isSelector = document.evaluate('//link[@rel="canonical"]/@href', document).iterateNext();
      if (isSelector) {
        let tempurl = isSelector.textContent;
        return `https://www.petsmart.com${tempurl}`;
      }
    }, url);
    url = newUrl || url;
    await context.goto(`${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"discard_CSP_header":true,"force200": true}[/!opt!]`, { timeout, waitUntil: 'load', checkBlocked: true });
    await context.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle0' });
  },
};
