const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    let scrollTop = 0;
    while (scrollTop !== 15000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 15000) {
        await stall(500);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const searchUrl = window.location.href;
    const products = document.querySelectorAll('div[aria-label="Search Results"] div[class*="grid__row"] > div');
    products.forEach(product => {
      product.setAttribute('searchurl', searchUrl);
    });
  });

  var extractedData = await context.extract(productDetails, { transform });

  extractedData.forEach(page => {
    page.group.forEach(product => {
      const thumbnail = product.thumbnail;
      if (thumbnail) {
        const hasMoreUrls = (thumbnail[0].text.match(/http/g) || []).length > 1;
        if (hasMoreUrls) {
          product.thumbnail[0].text = thumbnail[0].text.match(/(?:([^"'\s,]+)\s*(?:\s+\d+[wx])(?:,\s*)?)+/) ? thumbnail[0].text.match(/(?:([^"'\s,]+)\s*(?:\s+\d+[wx])(?:,\s*)?)+/)[1] : thumbnail[0].text;
        }
      }

      const productUrl = product.productUrl;
      if (productUrl) {
        if (!productUrl[0].text.includes('http')) {
          product.productUrl[0].text = 'https://www.staplesadvantage.com' + productUrl[0].text;
        }
      }
    });
  });

  return extractedData;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: transform,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
  implementation,
};
