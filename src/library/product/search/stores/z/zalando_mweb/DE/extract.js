// @ts-nocheck
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    transform,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform }, context, { productDetails }) => {
    // checking for selected language and changing to German if required
    const englishSelected = await context.evaluate(async () => !!document.querySelector('a[title="Choose language"]'));
    if (englishSelected) {
      console.log('Changing language');
      await context.click('a[title="Choose language"]');
      await context.waitForSelector('div.z-navicat-header_modalContent', { timeout: 10000 });
      const changingLanguage = await context.evaluate(async () => {
        const deutschLabel = document.evaluate(
          '//label[@class="z-navicat-header_radioItem"][contains(. , "Deutsch")]',
          document,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        if (deutschLabel) {
          deutschLabel.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return !!document.querySelector('div.z-navicat-header_modalContent button[class*="Primary"]');
        }
      });
      if (changingLanguage) {
        await context.click('div.z-navicat-header_modalContent button[class*="Primary"]');
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      }
      console.log('Finished changing language');
    }

    await context.evaluate(async () => {
      const scriptText = document.querySelector('script[id="z-nvg-cognac-props"]').textContent;
      const scriptObj = JSON.parse(scriptText.match(/<!\[CDATA\[(.+)\]\]>/)[1]);

      const listElem = document.createElement('ol');
      listElem.id = 'added_product_list';
      listElem.style.display = 'none';
      for (let i = 0; i < scriptObj.articles.length; i++) {
        const product = scriptObj.articles[i];
        const productElem = document.createElement('li');

        productElem.setAttribute('search_url', window.location.href);
        productElem.setAttribute('sku', product.sku);
        productElem.setAttribute('name', product.name);
        productElem.setAttribute('product_url', `https://m-en.zalando.de/${product.url_key}.html`);
        productElem.setAttribute(
          'thumbnail',
          `https://img01.ztat.net/article/${product.media.find((item) => item.role === 'DEFAULT').path}`,
        );
        productElem.setAttribute('price', product.price.promotional);
        productElem.setAttribute('manufacturer', product.brand_name);

        listElem.appendChild(productElem);
      }
      document.body.appendChild(listElem);
    });
    return await context.extract(productDetails, { transform });
  },
};
