const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    if (document.querySelector('div form[id*="buy_block"] p input:nth-child(2)')) {
      const a = document.querySelector('div form[id*="buy_block"] p input:nth-child(2)').getAttribute('value');
      console.log(a);
      const a1 = a.concat('-');
      // let b= arr[i].getAttribute("data-id-product-attribute");
      const mainDataObj = window.rcTagManagerLib.getInstance.productsListCache[a1.concat('0')].ean13;
      console.log(mainDataObj);
      if (mainDataObj) {
        addElementToDocument('gtin', mainDataObj);
      }
      // const sku_number = window.rcTagManagerLib.getInstance.productsListCache[a1.concat('0')].reference;
      // console.log(sku_number);
      // if (sku_number) {
      //   addHiddenDiv('sku_number', sku_number);
      // }
    }
    const productId = window.id_product;
    console.log(productId);
    if (productId) {
      addElementToDocument('product_id', productId);
    }
    const productReference = window.productReference;
    console.log(productReference);
    if (productReference) {
      addElementToDocument('sku', productReference);
    }
    if (document.querySelector('.heading-manufacturer')) {
      const brand = document.querySelector('.heading-manufacturer').innerText;
      console.log(brand);
    }
    if (document.querySelector('.title-product')) {
      const name = document.querySelector('.title-product').innerText;
      console.log(name);
      var nameExtended = name;
      if (document.querySelector('.t_vo .title-detalle')) {
        const variant = document.querySelector('.t_vo .title-detalle').innerText;
        console.log(variant);
        if (variant) {
          nameExtended = nameExtended.concat(' ' + variant);
        }
      }
      if (nameExtended) {
        console.log('Hello World');
        console.log(nameExtended);
        addElementToDocument('nameExtended', nameExtended);
      }
      if (document.querySelector('div[itemprop="aggregateRating"] div div meta[itemprop="ratingValue"]')) {
        var aggregateRating = document.querySelector('div[itemprop="aggregateRating"] div div meta[itemprop="ratingValue"]').getAttribute('content');
        console.log(aggregateRating);
        aggregateRating = aggregateRating.replace('.', ',').trim();
        console.log(aggregateRating);
        if (aggregateRating) {
          addElementToDocument('aggregateRating', aggregateRating);
        }
      }
    }
    if (document.querySelector('div[id="add_to_cart_wrap"]')) {
      const availability = document.querySelector('div[id="add_to_cart_wrap"]').getAttribute('class');
      console.log('availability==========' + availability);
      if (availability.includes('unvisible')) {
        addElementToDocument('availability', 'Out of Stock');
      } else {
        addElementToDocument('availability', 'In Stock');
      }
    }
  });
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { cleanUp });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    transform: cleanUp,
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
  implementation,
};
