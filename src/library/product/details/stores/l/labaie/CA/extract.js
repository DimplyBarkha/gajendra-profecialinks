const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'labaie',
    transform,
    domain: 'labaie.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const src = await context.evaluate(() => {
      const iframe = document.querySelector('#collapsible-details-1 iframe');
      // @ts-ignore
      const src = iframe ? iframe.src : null;
      return src;
    });
    await context.evaluate(() => {
      if (document.querySelector('#consent-close')) {
        // @ts-ignore
        document.querySelector('#consent-close').click();
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const iframe = document.querySelector('#collapsible-details-1 iframe');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      addHiddenDiv('videos', src);
      const element = document.querySelectorAll('#collapsible-details-1 li');
      if (element) {
        for (let i = 1; i <= element.length; i++) {
          if (document.querySelector(`#collapsible-details-1 li:nth-child(${i})`) && document.querySelector(`#collapsible-details-1 li:nth-child(${i})`).textContent) {
            const val = document.querySelector(`#collapsible-details-1 li:nth-child(${i})`).textContent.replace(/(.*)/, '|| $1');
            document.querySelector(`#collapsible-details-1 li:nth-child(${i})`).textContent = val;
          }
        }
      }

      // @ts-ignore
      const response = document.querySelector("script[type='application/ld+json']") ? JSON.parse(document.querySelector("script[type='application/ld+json']").innerText) : null;
      if (response) {
        const gtin = response.gtin13 && response.gtin13;
        const sku = response.sku && response.sku;
        const mpc = response.mpn && response.mpn;
        const ratingCount = response.aggregateRating && response.aggregateRating.ratingValue;
        const reviewCount = response.aggregateRating && response.aggregateRating.reviewCount;
        gtin && addHiddenDiv('gtin', gtin);
        sku && addHiddenDiv('sku', sku);
        mpc && addHiddenDiv('mpc', mpc);
        ratingCount && addHiddenDiv('pd_rating', ratingCount);
        reviewCount && addHiddenDiv('pd_review', reviewCount);
      }
      const scripts = document.querySelectorAll('script[type="text/javascript"]');
      // @ts-ignore
      const scriptDiv = scripts && Array.from(scripts, ele => ele.innerText);
      const pageData = scriptDiv && scriptDiv.filter(element => element.match(/(.*)pageDataObj(.*)"skus"(.*)/));
      const pageObject = pageData && pageData[0] && pageData[0].match(/(.*)pageDataObj = (.*);/) && pageData[0].replace(/(.*) = (.*);/, '$2');
      const responseSku = pageObject && JSON.parse(pageObject);
      if (responseSku && responseSku.products && responseSku.products[0] && responseSku.products[0].skus) {
        const products = responseSku.products[0].skus;
        products.forEach(product => {
          product.sku && addHiddenDiv('pd_sku', product.sku);
        });
      }
    });
    await context.extract(productDetails, { transform });
    if (src) {
      await context.goto(src, { timeout: 40000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('#videoview');
      await new Promise(resolve => setTimeout(resolve, 10000));
      await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    }
  },
};
