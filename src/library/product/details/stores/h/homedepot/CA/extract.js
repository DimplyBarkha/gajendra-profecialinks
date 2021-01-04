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
          if (response.alternateImages) {
            response.alternateImages.forEach(image => {
              image.url && addElementToDocument('pd_altimage', image.url);
            });
          }
          if (response.price) {
            response.price.formattedValue && addElementToDocument('pd_price', response.price.formattedValue);
          }
          if (response.urls) {
            response.urls.en && addElementToDocument('pd_url', response.urls.en);
          }
          if (response.videoTags) {
            response.videoTags.forEach(video => {
              addElementToDocument('pd_video', video);
            });
          }
          if (response.variantOptionsSorted) {
            response.variantOptionsSorted.forEach(variants => {
              variants.variantOptionQualifiers && variants.variantOptionQualifiers.forEach(variant => {
                variant.code && addElementToDocument('pd_variants', variant.code);
                variant.selected && variant.value && addElementToDocument('pd_variantInfo', variant.value);
              });
            });
          }
          if (response.promotionMessages) {
            response.promotionMessages.pipMessage && addElementToDocument('pd_promotion', response.promotionMessages.pipMessage);
          }
          if (response.averageRating) {
            addElementToDocument('pd_aggregate', response.averageRating);
          }
          if (!document.querySelector('#wc-aplus,#inpage_container')) {
            if (response.modelNumber) {
              const catElement1 = document.createElement('script');
              catElement1.async = true;
              catElement1.type = 'text/javascript';
              catElement1.src = `https://media.flixcar.com/delivery/js/inpage/7202/b5/mpn/${response.modelNumber}?&=7202&=b5&mpn=${response.modelNumber}&ssl=1&ext=.js`;
              catElement1.crossOrigin = 'true';
              document.querySelector('.hdca-product') && document.querySelector('.hdca-product').appendChild(catElement1);
            }
          }
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
