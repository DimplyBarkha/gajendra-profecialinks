
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
    const productAvailable = document.querySelector('div.no-results-container');
    if (productAvailable) {
      throw Error('No results found for RPC');
    }

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('h1.product-name');

    const jsonString = JSON.parse(document.evaluate('//script[@type="application/ld+json"]', document).iterateNext().innerText);
    const sku = jsonString.offers.map(e => e.sku);
    for (let i = 0; i < sku.length; i++) {
      const newLi = document.createElement('li');
      document.querySelector('h1.product-name').appendChild(newLi);
      newLi.id = `item${i}`;
    }
    const array = [...document.querySelectorAll('h1.product-name li')];

    for (let i = 0; i < sku.length; i++) {
      fetch(`https://www.1800petmeds.com/on/demandware.store/Sites-1800petmeds-Site/default/Product-Variation?pid=${sku[i]}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          array[i].setAttribute('sku', data.product.id);
          array[i].setAttribute('listPrice', data.product.listPrice);
          array[i].setAttribute('brand', data.product.brand);
          array[i].setAttribute('availability', data.product.availability.messages[0] === 'In Stock' ? 'In Stock' : 'Out of Stock');
          array[i].setAttribute('productName', `${document.querySelector('h1.product-name').textContent}${data.product.productName}`);
          array[i].setAttribute('price', data.product.price.sales.formatted);
          array[i].setAttribute('firstvariant', sku[0]);
          array[i].setAttribute('mainImage', data.product.images.large[0].url);
          array[i].setAttribute('imageAlt', data.product.images.large[0].alt);
          array[i].setAttribute('variants', sku);
          array[i].setAttribute('variantcount', sku.length === 0 ? '0' : sku.length);
          array[i].setAttribute('manufacturer', data.product.attributes[0].attributes[0].value);
          array[i].setAttribute('variantinformation', data.product.productName);
        });
      optionalWait('h1.product-name li:nth-last-child(1)');
    }
    document.querySelectorAll('div#productInfo ul li').forEach((ele) => ele.textContent = (` || ${ele.textContent}`));
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
    transform,
    domain: '1800petmeds.com',
    zipcode: '',
  },
  implementation,
};
