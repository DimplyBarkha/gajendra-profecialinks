const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      await context.waitForSelector('.hdca-product__description');
    } catch (error) {
      console.log('product description is not loaded');
    }
    try {
      await context.click('.hdca-video__play');
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.log('no localized button found');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const skuNumber = window.location.href;
      if (skuNumber.match(/\/(\d+)/)) {
        console.log('sku number match', skuNumber.match(/\/(\d+)/)[1]);
        const response = await fetch(`https://www.homedepot.ca/homedepotcacommercewebservices/v2/homedepotca/products/${skuNumber.match(/\/(\d+)/)[1]}.json?fields=BASIC_SPA&lang=en`)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
        console.log('response', response);
        await new Promise(resolve => setTimeout(resolve, 10000));
        if (response) {
          if (response.alternateImages) {
            response.alternateImages.forEach(image => {
              image.url && addElementToDocument('pd_altimage', image.url);
            });
          }
          if (response.price) {
            response.price.formattedValue && addElementToDocument('pd_price', response.price.formattedValue);
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
