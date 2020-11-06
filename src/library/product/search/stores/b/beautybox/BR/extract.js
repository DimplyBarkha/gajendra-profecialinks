const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForNavigation();
  var isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('button#onetrust-accept-btn-handler');
  });
  if (isPopupPresent) {
    await context.click('button#onetrust-accept-btn-handler');
  }

  var isAllProductsTabPresent = await context.evaluate(async () => {
    return document.querySelector('a[data-id="produtos"]');
  });
  if (isAllProductsTabPresent) {
    await context.click('a[data-id="produtos"]');
  }

  var isButtonPresent = await context.evaluate(async () => {
    return document.querySelector('button.btn-load-more');
  });
  while (isButtonPresent) {
    await context.click('button.btn-load-more');
    await context.waitForSelector('button.btn-load-more', { timeout: 1500 });
    isButtonPresent = await context.evaluate(async () => {
      return document.querySelector('button.btn-load-more');
    });
  }

  await context.evaluate(() => {
    const products = document.querySelectorAll('div[class*="showcase-gondola"] div.showcase-item[data-event]');
    products.forEach((product, index) => {
      const productData = JSON.parse(product.getAttribute('data-event'));
      product.setAttribute('id', productData.sku);
      product.setAttribute('rankorganic', `${index + 1}`);
    });
  });

  var dataRef = await context.extract(productDetails, { transform });
  dataRef[0].group.forEach((row) => {
    if (row.aggregateRating2.length > 1) {
      row.aggregateRating2[0].text += ',' + row.aggregateRating2[1].text;
      row.aggregateRating2.splice(1, 1);
    }
  });
  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'beautybox',
    transform: transform,
    domain: 'beautybox.com.br',
    zipcode: '',
  },
  implementation,
};
