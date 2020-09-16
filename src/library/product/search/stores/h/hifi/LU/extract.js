
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    transform,
    domain: 'hifi.lu',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const productList = await context.evaluate(async function () {
      const mainElement = document.querySelectorAll('section[class~="products-overview"] div[class~="row"] > div');
      return mainElement ? mainElement.length : '';
    });
    if (productList) {
      for (let index = 1; index <= productList; index++) {
        const selector = `section[class~="products-overview"] div[class~="row"] > div:nth-child(${index})`;
        await context.evaluate(async function (selector) {
          const index = selector[1];
          if (selector && index) {
            const element = document.querySelector(selector[0]);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
              await new Promise(resolve => setTimeout(resolve, 2000));
              const currentImage = document.querySelector(`${selector[0]} img[class~="product-image"]`);
              if (currentImage) {
                const prodEle = document.createElement('div');
                prodEle.id = 'pd_image';
                prodEle.textContent = currentImage.src;
                document.querySelector(`section[class~="products-overview"] div[class~="row"] > div:nth-child(${index})`).appendChild(prodEle);
              }
            }
          }
        }, [selector, index]);
      }
    }
    return await context.extract(productDetails, { transform });
  },
};
