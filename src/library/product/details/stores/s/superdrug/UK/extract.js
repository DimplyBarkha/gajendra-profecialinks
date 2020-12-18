const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    // get nameExtended with dash 'brand - product_name'
    const name = document.querySelector('h1.pdp__productName') ? document.querySelector('h1.pdp__productName').innerText : null;
    const brand = document.querySelector('span.pdp__byBrand>a') ? document.querySelector('span.pdp__byBrand>a').innerText : null;
    if (name !== null && brand !== null) {
      // @ts-ignore
      addElementToDocument('nameextended', `${brand} - ${name}`);
    }

    const prefix = 'https://www.superdrug.com';
    const brandName = document.querySelector('span.pdp__byBrand>a') ? document.querySelector('span.pdp__byBrand>a').getAttribute('href') : null;
    if (brandName !== null) {
      const brandLink = brandName.replace(/\s/g, '%20');
      // @ts-ignore
      addElementToDocument('brandlink', `${prefix}${brandLink}`);
    }

    const isImgZoom = document.querySelector('div.pdp-gallery__large-img')
      ? document.querySelector('div.pdp-gallery__large-img') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: cleanUp,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation,
};
