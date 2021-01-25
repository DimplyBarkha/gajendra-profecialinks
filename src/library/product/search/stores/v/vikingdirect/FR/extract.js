const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    transform,
    domain: 'vikingdirect.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });
    await context.evaluate(async function () {
      const products = document.querySelectorAll('div.skuListSku, div.skuTopDetailsContainer');
      for (let i = 0; i < products.length; i++) {
        const productId = document.evaluate('.//div[@class="skuListSkuDescription"]/following-sibling::input[contains(@name, "sku_withoutEffortCode")]|//input[@name="recordSpecValue"]', products[i], null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
        const productIdText = productId && productId.getAttribute('value') ? productId.getAttribute('value') : '';
        products[i].setAttribute('product_id_value', productIdText);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    return await context.extract(productDetails, { transform });
  },
};
