const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.click('button.dbk-accordion__header');
    await context.waitForSelector('div.dbk-accordion__body');
    await context.waitForSelector('footer.dbk-footer');
    await context.evaluate(async () => {
      const element = document.querySelector('footer.dbk-footer');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    });
  }
  catch (error) {
    console.log(error);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },
  implementation,
};
