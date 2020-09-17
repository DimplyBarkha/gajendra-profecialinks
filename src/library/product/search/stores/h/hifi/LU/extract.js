
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
    await context.evaluate(async function () {
      const mainElement = document.querySelectorAll('section[class~="products-overview"] div[class~="row"] > div');
      if (mainElement) {
        for (let index = 1; index <= mainElement.length; index++) {
          const selector = `section[class~="products-overview"] div[class~="row"] > div:nth-child(${index})`;
          if (selector) {
            const element = document.querySelector(`${selector} div[class~="top-content"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              await new Promise(resolve => setTimeout(resolve, 2000));
              const currentImage = document.querySelector(`${selector} img[class~="product-image"]`);
              const imagePresent = document.querySelector(`${selector} #pd_image`);
              if (imagePresent) {
                imagePresent.remove();
              }
              await new Promise(resolve => setTimeout(resolve, 2000));
              if (currentImage) {
                const prodEle = document.createElement('div');
                prodEle.id = 'pd_image';
                prodEle.textContent = currentImage.src;
                prodEle.style.display = 'none';
                document.querySelector(`section[class~="products-overview"] div[class~="row"] > div:nth-child(${index})`).appendChild(prodEle);
              }
            }
          }
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
