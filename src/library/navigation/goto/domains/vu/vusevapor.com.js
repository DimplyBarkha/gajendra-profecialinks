
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'vusevapor.com',
    timeout: null,
    country: 'US',
    store: 'vusevapor',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });

    await context.waitForSelector('div.age-gate__content', { timeout: 10000 })
      .then(async () => {
        await context.evaluate(() => {
          const confirmButton = document.evaluate("//button[contains(text(),'21+')]", document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
          confirmButton.click();
        });
      })
      .catch(() => console.log('No age verification needed!'));
  },
};
