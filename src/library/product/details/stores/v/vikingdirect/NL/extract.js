const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value, src) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.innerText = value;
      catElement.setAttribute('src', src);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const name = document.querySelector('h1[itemprop="name"]') ? document.querySelector('h1[itemprop="name"]').innerText : null;
    const brand = document.querySelector('span[class="product__brand-name"] a') ? document.querySelector('span[class="product__brand-name"] a').innerText : null;
    if (name !== null && brand !== null) {
      // @ts-ignore
      addElementToDocument('nameextended', `${brand} - ${name}`);
    }

    const brandUrl = document.querySelector('span[class="product__brand-name"] a').getAttribute('href');
    const prefix = 'https://www.vikingdirect.nl';
    const brandLink = brandUrl.startsWith('http') ? brandUrl : prefix + brandUrl;
    addElementToDocument('brandLink', brandLink);

    const price = document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]')
      ? document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]').textContent : null;
    const regex = /(\d+,\d+)/;
    // @ts-ignore
    if (price !== null) {
      document.querySelector('body').setAttribute('price', price.match(regex)[1]);
    }

    // if product is not available set availabilityText to Out of Stock
    const availabilityText = document.querySelector('span[class="product-stock-message__title"]') ? document.querySelector('span[class="product-stock-message__title"]').innerText : null;
    if (availabilityText === null && document.querySelector('div[role="alertdialog"]').innerText === 'Helaas is dit product niet langer beschikbaar') {
      addElementToDocument('availabilityText', 'Out of Stock');
    } else if (availabilityText) {
      addElementToDocument('availabilityText', availabilityText);
    }
  });

  // return await context.extract(productDetails, { transform });
  const dataRef = await context.extract(productDetails, { transform });
  if (dataRef[0].group[0].image) {
    dataRef[0].group[0].image[0].text = 'https:' + dataRef[0].group[0].image[0].text;
  }
  return dataRef;
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    transform: cleanUp,
    domain: 'vikingdirect.nl',
    zipcode: '',
  },
  implementation,
};
