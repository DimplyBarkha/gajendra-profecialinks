const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForNavigation();
  await context.evaluate(async () => {
    const closePopupButton = document.querySelector('button#accept-consent-all');
    if (closePopupButton) {
      // @ts-ignore
      closePopupButton.click();
    }
  });
  await context.evaluate(async () => {
    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const searchUrl = window.location.href;
    addElementToDocument('searchurl', searchUrl);

    const products = document.querySelectorAll('ol[class="products-list"] > li');
    const scriptTags = document.querySelectorAll(' head script:not([type]):not([src])');
    const arrayOfGTINS = [];
    if (scriptTags !== undefined && scriptTags !== null) {
      // @ts-ignore
      const gtinText = [...scriptTags].map(e => e.innerText).filter(e => e.includes('gtin'));

      gtinText[0].split('position').forEach(e => {
        if (e.includes('gtin')) arrayOfGTINS.push(e.match(/gtin":"(\d+)/)[1]);
      });
    }
    if (products !== undefined && products !== null) {
      products.forEach((e, index) => {
        e.setAttribute('gtin', arrayOfGTINS[index]);
        e.setAttribute('rank', `${index + 1}`);
      });
    }
  });
  var dataRef = await context.extract(productDetails, { transform });

  dataRef[0].group.forEach((row) => {
    if (row.productUrl) {
      row.productUrl.pop();
    }
  });

  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    transform: transform,
    domain: 'mytime.de',
    zipcode: '',
  },
  implementation,
};
