
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'esselungaacasa.it',
    timeout: null,
    country: 'IT',
    store: 'esselungaacasa',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    const homeUrl = 'https://www.esselungaacasa.it/ecommerce/nav/welcome/index.html';
    await context.goto(homeUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    const modal = await context.evaluate(async () => {
      return document.querySelector('div#remodalDialog');
    });
    if (modal) {
      await context.click('span[class="close"] a[data-remodal-action="close"]');
    }
    await context.waitForSelector('input#postcode');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.setInputValue('input#postcode', '20141');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.click('button[type="submit"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForSelector('div#remodalDialog');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.click('span[class="close"] a[data-remodal-action="close"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForSelector('div#mainContent');
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
