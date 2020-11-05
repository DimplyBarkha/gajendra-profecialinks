const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    let variantId = '';
      variantId = document.querySelector('link[rel="canonical"]').href.match(/\d+$/)[0];
    const isVariants = document.querySelector('button[data-test-id="SingleSizeDropdownButton"]');
    if (isVariants) {
      const jsonString = JSON.parse(document.evaluate('//script[@type="application/ld+json"][contains(.,"Product")]', document).iterateNext().innerText);
      const sku = jsonString.offers.map(e => e.sku);
      const price = jsonString.offers.map(e => e.price);
      const url = jsonString.offers.map(e => e.url);
      for (i = 0; i < sku.length; i++) {
        const newLi = document.createElement('li');
        document.querySelector('ul[data-test-id="DropdownList"]').appendChild(newLi);
        newLi.id = `item${i}`;
      }
      let array = [...document.querySelectorAll('ul[data-test-id="DropdownList"] li')];
      for (i = 0; i < array.length; i++) {
        // array[i].setAttribute('variants', sku);
        // array[i].setAttribute('firstvariant', sku[0]);
        // array[i].setAttribute('price', price[i]);
        // array[i].setAttribute('url', url[i]);
      }

      fetch(`https://api-cloud.aboutyou.de/v1/products/${variantId}?with=variants%2Cvariants.attributes%2Cimages.attributes%3Alegacy%28false%29%2CpriceRange&campaignKey=px&shopId=605`)
        .then(response => response.json())
        .then(data => {
          console.log(data.variants);
          for (let i = 0; i < data.variants.length; i++) {
            array[i].setAttribute('sku', data.variants[i].id);
            array[i].setAttribute('mpn', data.variants[i].referenceKey);
            array[i].setAttribute('availability', data.variants[i].stock.quantity);
            array[i].setAttribute('ean', data.variants[i].attributes.ean.values.value);
            array[i].setAttribute('size', `${data.variants[i].attributes.vendorSize.values.value} ${data.variants[i].attributes.shopSize.values.label}`);
          }
        });
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    transform,
    domain: 'aboutyou.de',
    zipcode: '',
  },
  implementation,
};