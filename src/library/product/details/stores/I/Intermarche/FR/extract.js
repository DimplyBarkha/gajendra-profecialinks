const { cleanUp } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const closeSelector = '#didomi-notice-agree-button';
  const checkPresence = async (closeSelector) => {
    return await context.evaluate((selector) => {
      return Boolean(document.querySelector(selector));
    }, closeSelector);
  };
  const test = checkPresence(closeSelector);
  try {
    if (test) {
      await context.click(closeSelector);
    }
  } catch (e) {
    console.log('not able to click', true);
  }
  await context.evaluate(() => {
    // Implementation for getting the availability
    const Ispresent = document.querySelector('#add-product-button > div > div > a');
    if (Ispresent) {
      const newDiv = document.createElement('div');
      newDiv.className = 'avail';
      newDiv.setAttribute('availability', 'In stock');
      const body = document.querySelector('body');
      if (body) {
        body.append(newDiv);
      }
    }
    // Implementation for getting the product description
    const isValid = document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]').length;
    if (isValid) {
      const appendContent = document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]');
      let data = '';
      for (let i = 1; i < appendContent.length; i++) {
        data = data + ' ' + appendContent[i].innerText;
      }
      const brandName = document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]') && document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]').innerText;
      let finalName = '';
      finalName = brandName.concat(data);
      const nameDiv = document.createElement('div');
      nameDiv.className = 'productName';
      nameDiv.setAttribute('name', finalName);
      const body = document.querySelector('body');
      if (body) {
        body.append(nameDiv);
      }
    }
    // Implementation for getting the Variant id
    const productLink = window.location.href;
    const targetValue = productLink.match(/(\d{13})/g)[0];
    const rpcDiv = document.createElement('div');
    rpcDiv.className = 'rpcValue';
    rpcDiv.setAttribute('rpc', targetValue);
    const appendElement = document.querySelector('body');
    if (appendElement) {
      appendElement.append(rpcDiv);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'Intermarche',
    transform: cleanUp,
    zipcode: '',
    domain: 'intermarche.com',
  },
  implementation,
};
