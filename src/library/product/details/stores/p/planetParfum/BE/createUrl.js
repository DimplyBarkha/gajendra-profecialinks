
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'planetparfum.com',
    prefix: null,
    url: null,
    country: 'BE',
    store: 'planetParfum',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const mainUrl = 'https://www.planetparfum.com/fr/';
    await context.goto(mainUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('li.search.shortcut-search-suggest');
    await context.click('form[role=search] fieldset input[type=text]');
    await context.waitForSelector('form[role=search] fieldset input[type=text]');
    await context.setInputValue('form[role=search] fieldset input[type=text]', inputs.id);
    await context.click('form[role=search] fieldset input.form-submit');
    await context.waitForSelector('body');
    const productUrl = await context.evaluate(async () => (document.querySelector('span[itemprop="url"]') ? document.querySelector('span[itemprop="url"]').innerText : window.location.href));
    return productUrl;
  },
};
