const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async () => {
    function addProp (name, prop) {
      let j = 0;
      prop.forEach(element => {
        if (prop[j] !== null && prop[j] !== undefined) {
          document.querySelectorAll('.productinfo')[j].setAttribute(name, element);
          j++;
        }
      });
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const productUrl = [];
    const price = [];
    const name = [];
    const productId = [];
    const productImage = [];
    let k = 0;
    // scroll

    let scrollTop = 0;
    const scrollLimit = 10000;
    await stall(3000);
    while (scrollTop <= scrollLimit) {
      const productSelectorURL = document.querySelectorAll('a[data-v-c701e340]');
      productSelectorURL.forEach(element => {
        if (!(productUrl.includes(element.href))) {
          productUrl.push(element.href);
          name.push(productUrl[k].match('[^/]*$'));
          k++;
        }
      });
      const productSelectorID = document.querySelectorAll('div.mq-grid-item>article');
      productSelectorID.forEach(element => {
        if (!(productId.includes(element.id))) {
          productId.push(element.id);
        }
      });
      const productSelectorImage = document.querySelectorAll('img[data-v-c701e340]');
      productSelectorImage.forEach(element => {
        if (!(productImage.includes(element.src))) {
          productImage.push(element.src);
        }
      });
      const productSelectorPrice = document.querySelectorAll('.mq-product-prices>h3');
      productSelectorPrice.forEach(element => {
        if (!(price.includes(element.textContent))) {
          price.push(element.textContent);
        }
      });
      scrollTop += 1006;
      window.scroll(0, scrollTop);
      await stall(1000);
    }

    for (let i = 0; i < productUrl.length; i++) {
      const productInfo = document.createElement('div');
      productInfo.className = 'productinfo';
      document.body.appendChild(productInfo);
    };

    addProp('producturl', productUrl);
    addProp('id', productId);
    addProp('name', name);
    addProp('image', productImage);
    addProp('price', price);

    let l = 0;

    const rank = document.querySelectorAll('.productinfo');

    rank.forEach(element => {
      document.querySelectorAll('.productinfo')[l].setAttribute('rank', `${l + 1}`);
      l++;
    });
  });

  return await context.extract(productDetails, 'MERGE_ROWS');
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
