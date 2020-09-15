
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ubaldi.com',
    timeout: null,
    country: 'FR',
    store: 'ubaldi',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout = 20000 }, context, dependencies) => {
    if (!url.includes('#[!opt!]')) {
      url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    }
    url = url.replace(/\s+|(%20)/g, '-');
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    const pathName = await context.evaluate(() => {
      return window.location.pathname;
    });
    console.log('pathName: ', pathName);
    if (pathName === '/dyson/dyson.php') {
      await context.goto('https://www.ubaldi.com/recherche/dyson-brand.php', { timeout, waitUntil: 'load', checkBlocked: true });
    }
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
