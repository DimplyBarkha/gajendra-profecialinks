const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const isSelectorAvailable = async (cssSelector) => {
    console.log(`Is selector available: ${cssSelector}`);
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  const cssProduct ='div.lister-productitem__wrapper';
  const cssProductDetails = 'div.dbk-productdetail--maininfo'
  const productAvailable = await isSelectorAvailable('div.lister-productitem__wrapper');
  console.log(`productAvailable: ${productAvailable}`);
  if (productAvailable) {
    await context.click(cssProduct);
    await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
    await context.waitForSelector(cssProductDetails);
    const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
    console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
    if (!productDetailsAvailable) {
      throw new Error('ERROR: Failed to load product details page');
    }
    console.log('navigation complete!!');
  }

  try {
    await context.click('button.dbk-accordion__header');
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
