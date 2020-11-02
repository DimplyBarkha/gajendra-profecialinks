
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    transform: null,
    domain: 'lyreco.it',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    try {
      await context.waitForSelector('div#productCmsGrid div.item-content>div.picture_grid>a');
    } catch (err) {
      console.log('Search result did not load');
    }
    const selector = await context.evaluate(() => {
      return Boolean(document.querySelector('div#productCmsGrid div.item-content>div.picture_grid>a'));
    });
    if (selector) {
      try {
        await context.click('div#productCmsGrid div.item-content>div.picture_grid>a');
        await context.waitForSelector('.s7staticimage');
      } catch (err) {
        console.log('Unable to direct to product page');
      }
    }
    return await context.extract(variants, { transform });
  },
};
