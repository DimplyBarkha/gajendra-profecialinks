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
    await context.waitForSelector('script[id="z-nvg-cognac-props"]');

    await context.evaluate(async () => {
      const scriptText = document.querySelector('script[id="z-nvg-cognac-props"]').textContent;
      const scriptObj = JSON.parse(scriptText.match(/<!\[CDATA\[(.+)\]\]>/)[1]);

      const oldListElem = document.querySelector('ol#added_product_list');
      if (oldListElem) oldListElem.remove();

      const listElem = document.createElement('ol');
      listElem.id = 'added_product_list';
      listElem.style.display = 'none';

      const allProducts = document.querySelectorAll('article[role="link"]');
      for (let i = 0; i < allProducts.length; i++) {
        const productElem = document.createElement('li');
        const product = allProducts[i];
        const productUrl = product.querySelector('a') ? product.querySelector('a').href : '';
        const sku = productUrl.match(/(\w{9}-\w{3})\.html/) ? productUrl.match(/(\w{9}-\w{3})\.html/)[1] : '';
        const imageSrc = product.querySelector('article[role="link"] > a > figure img:not([aria-hidden])')
          ? product.querySelector('article[role="link"] > a > figure img:not([aria-hidden])').src
          : '';
        const imageUrl = imageSrc.match(/(.+\.jpg)/) ? imageSrc.match(/(.+\.jpg)/)[1] : imageSrc;
        const name = product.querySelector('article a > header h3')
          ? product.querySelector('article a > header h3').textContent
          : '';
        const brand = document.evaluate(
          './/a/header//h3/preceding-sibling::span',
          product,
          null,
          XPathResult.STRING_TYPE,
          null,
        ).stringValue;

        const priceString = document.evaluate(
          './/a/header//h3/parent::div/following-sibling::div[span[contains(. , "€")]]/span[1]',
          product,
          null,
          XPathResult.STRING_TYPE,
          null,
        ).stringValue;
        const price = priceString.match(/(\d+([\d,.]+)?.?€)/) ? priceString.match(/(\d+([\d,.]+)?.?€)/)[1] : '';

        productElem.setAttribute('search_url', window.location.href);
        productElem.setAttribute('sku', sku);
        productElem.setAttribute('name', name);
        productElem.setAttribute('product_url', productUrl);
        productElem.setAttribute('thumbnail', imageUrl);
        productElem.setAttribute('price', price);
        productElem.setAttribute('manufacturer', brand);

        listElem.appendChild(productElem);
      }
      document.body.appendChild(listElem);

      // for (let i = 0; i < scriptObj.articles.length; i++) {
      //   const product = scriptObj.articles[i];
      //   const productElem = document.createElement('li');

      //   productElem.setAttribute('search_url', window.location.href);
      //   productElem.setAttribute('sku', product.sku);
      //   productElem.setAttribute('name', product.name);
      //   productElem.setAttribute('product_url', `https://m-en.zalando.de/${product.url_key}.html`);
      //   productElem.setAttribute(
      //     'thumbnail',
      //     `https://img01.ztat.net/article/${product.media.find((item) => item.role === 'DEFAULT').path}`,
      //   );
      //   productElem.setAttribute('price', product.price.promotional);
      //   productElem.setAttribute('manufacturer', product.brand_name);

      //   listElem.appendChild(productElem);
      // }
      // document.body.appendChild(listElem);
    });
    return await context.extract(productDetails, { transform });
  },
};
