
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;

  const cssProduct = 'div.product-details div.product-title a';
  const cssProductDetails = 'div#sku-title';

  const isSelectorAvailable = async (cssSelector) => {
    console.log(`Is selector available: ${cssSelector}`);
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  console.log('.....waiting......');
  await context.waitForSelector(cssProduct, { timeout: 10000 });

  const productAvailable = await isSelectorAvailable(cssProduct);
  console.log(`productAvailable: ${productAvailable}`);
  if (productAvailable) {
    console.log('clicking product link');
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
  await context.evaluate(async (parentInput) => {

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    //---------------------------------------------
     let finalDescription1;
     let finalDescription = [];
     let descElement1;
     let descElement2;
     let descElement3;
     let description1 = document.querySelector('div.bbmx-product-description');
     descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
     let description2 = document.querySelector('div.includedItemsContainer ul');
     descElement2 = description2 ? description2.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
     let description3 = document.querySelector('div.features-list.all-features');
     descElement3 = description3 ? description3.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
     finalDescription1 = descElement1 + ' '+descElement2 + ' | '+descElement3;
     console.log('finalDescription1: ', finalDescription1);
     addElementToDocument('bb_description',finalDescription1);
    });
    return await context.extract(productDetails, { transform });
    }

