
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'logicvapes.us',
    timeout: 20000,
    country: 'US',
    store: 'logicvapes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 45000, waitUntil: 'load', checkBlocked: true });

    await context.waitForSelector('div.age-barrier-wrapper div.buttons', { timeout: 10000 })
      .then(async () => {
        await context.evaluate(() => {
          const confirmButton = document.evaluate("//a[contains(text(),'21+')]", document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
          confirmButton.click();
        });
      })
      .catch(() => console.log('No age verification needed!'));
  },
};
