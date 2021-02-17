const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  const { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    try {
      await context.waitForXPath('(//ul//div[contains(@class,"ltr")]//a/@href)[1]');
    } catch(error) {
      console.log(error);
    }
    

    try {
      await context.waitForSelector('ul div ul[class*=ltr] a');
    } catch(error) {
      console.log(error);
    }
      console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('ul div ul[class*=ltr] a');
      firstItem.click();
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
  implementation,
};
