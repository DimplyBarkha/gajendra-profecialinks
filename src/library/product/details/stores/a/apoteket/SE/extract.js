const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    transform,
    domain: 'apoteket.se',
    zipcode: '',
  },
  implementation
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
  await context.waitForSelector('div.product-grid__items div.grid-item');
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('div.grid-product__content.grid-item__content a')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      let finalLink
      // @ts-ignore
      if(firstItem.includes('http') & firstItem !== ''){
        finalLink = firstItem
      // @ts-ignore
      }else if(firstItem !== ''){
        finalLink = 'https://www.apoteket.se'+firstItem;
      }
      return finalLink;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  }
  await context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  await context.evaluate(async (parentInput) => {
  
    // function addElementToDocument (key, value) {
    //   const catElement = document.createElement('div');
    //   catElement.id = key;
    //   catElement.textContent = value;
    //   catElement.style.display = 'none';
    //   document.body.appendChild(catElement);
    // }
  
    //  addElementToDocument('bb_description',finalDescription1);
    });
    return await context.extract(productDetails, { transform });
    }
