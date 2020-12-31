const { transform } = require('./variantFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { variants }) => {
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
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.querySelector('.hdca-product') && document.querySelector('.hdca-product').appendChild(catElement);
      }
      const url = window.location.href;
      // @ts-ignore
      if (url && url.match(/q=(\d+)/) && url.match(/q=(\d+)/)[1]) {
        const response = await fetch(`https://www.homedepot.ca/homedepotcacommercewebservices/v2/homedepotca/products/${url.match(/q=(\d+)/)[1]}.json?fields=BASIC_SPA&lang=en`)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
        await new Promise(resolve => setTimeout(resolve, 10000));
        if (response) {
          if (response.variantOptionsSorted) {
            response.variantOptionsSorted.forEach(variants => {
              variants.variantOptionQualifiers && variants.variantOptionQualifiers.forEach(variant => {
                variant.code && addElementToDocument('pd_variants', variant.code);
                variant.url && addElementToDocument('pd_variantsUrl', variant.url);
              });
            });
          }
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(variants, { transform });
  },
};
