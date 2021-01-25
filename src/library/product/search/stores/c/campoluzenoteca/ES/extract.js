// const { transform } = require('./transform');
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    const itemContainers = document.querySelectorAll('#center_column > ul > li');
    const arr = document.querySelectorAll('#center_column > ul > li');
    let i = 0;
    const thumbnail = document.querySelectorAll('div[class="product-container"] > div> div >a > img');

    const productUrl = document.querySelectorAll('div.center_column > ul> li > div > div > div > h5 > a');
    console.log(productUrl);
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const a = arr[i].getAttribute('data-id-product');
      console.log(a);
      // addHiddenDiv(itemContainer, 'id', a);
      const a1 = a.concat('-');
      const b = arr[i].getAttribute('data-id-product-attribute');
      const mainDataObj = window.rcTagManagerLib.getInstance.productsListCache[a1.concat(b)].ean13;
      console.log(mainDataObj);
      if (mainDataObj) {
        addHiddenDiv(itemContainer, 'gtin', mainDataObj);
      }

      const thumb = thumbnail[i].getAttribute('src');
      if (thumb) {
        addHiddenDiv(itemContainer, 'thumbnail', thumb);
      }

      const prodUrl = productUrl[i].getAttribute('href');
      if (prodUrl) {
        console.log(prodUrl);
        addHiddenDiv(itemContainer, 'productUrl', prodUrl);
      }

      const productCode = window.rcTagManagerLib.getInstance.productsListCache[a1.concat(b)].reference;
      console.log(productCode);
      if (productCode) {
        addHiddenDiv(itemContainer, 'product_code', productCode);
      } else {
        const productCodeUpdated = window.rcTagManagerLib.getInstance.productsListCache[a1.concat(b)].id_product;
        if (productCodeUpdated) {
          addHiddenDiv(itemContainer, 'product_code', productCodeUpdated);
        }
      }
      const searchUrl = window.location.href;
      addHiddenDiv(itemContainer, 'search-url', searchUrl);
      i++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    transform: transform,
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
  implementation,
};
