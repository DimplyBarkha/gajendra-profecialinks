const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    window.scroll(0, 1000);
    if (document.querySelector('li#brand_navigation_item a')) {
      document.querySelector('li#brand_navigation_item a').click();
      if (document.querySelector('button.btn-expand.btn-reset img[src]')) {
        document.querySelector('button.btn-expand.btn-reset img[src]').click();
        await new Promise(resolve => setTimeout(resolve, 500));
        let scrollTop = 0;
        let lastscrollvalue = 0;
        while (scrollTop !== 7000) {
          await stall(750);
          lastscrollvalue = scrollTop;
          scrollTop += 1000;
          window.scroll(lastscrollvalue, scrollTop);
          if (scrollTop === 7000) {
            await stall(500);
            break;
          }
        }
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const allMeta = document.querySelectorAll('meta');
    let ean = '';
    let brand = '';
    if (allMeta) {
      for (let i = 0; i < allMeta.length; i++) {
        if (allMeta[i].hasAttribute('itemprop')) {
          if (allMeta[i].getAttribute('itemprop') === 'gtin13') {
            ean = allMeta[i].getAttribute('content');
          }
          if (allMeta[i].getAttribute('itemprop') === 'brand') {
            brand = allMeta[i].getAttribute('content');
          }
        }
      }
      console.log('-----EAN-----', ean);
      console.log('-----BRAND-----', brand);
    }

    if (!document.querySelector('#wc-aplus,#inpage_container')) {
      if (ean && brand) {
        const catElement1 = document.createElement('script');
        catElement1.async = true;
        catElement1.type = 'text/javascript';
        catElement1.src = `https://media.flixcar.com/delivery/js/inpage/2754/fr/ean/${ean}?&=2754&=fr&ean=${ean}&brand=${brand}&ssl=1&ext=.js`;
        catElement1.crossOrigin = 'true';
        document.querySelector('.hdca-product') && document.querySelector('.hdca-product').appendChild(catElement1);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation,
};
