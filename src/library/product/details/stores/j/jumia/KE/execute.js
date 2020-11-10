
async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.jumia.co.ke/catalog/?q={SKU}'.replace(
    '{SKU}',
    encodeURIComponent(inputs.id),
  );
  await dependencies.goto({ url });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const isProduct = await context.evaluate(function (sel) {
    const selector = document.querySelector(sel);
    return selector;
  }, parameters.loadedSelector);
  if (isProduct) {
    const gotoUrl = await context.evaluate(function () {
      const productSelector = document.querySelector('section.card.-fh > div > article > a');
      if (productSelector) {
        const productUrl = productSelector.getAttribute('href');
        return 'https://www.jumia.co.ke' + productUrl;
      }
    });
    console.log(gotoUrl);
    await context.goto(gotoUrl);
  }
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    domain: 'jumia.co.ke',
    loadedSelector: 'section.card.-fh',
    noResultsXPath: '//h2[contains(text(), "There are no results")]',
    zipcode: '',
  },
  implementation,
};
