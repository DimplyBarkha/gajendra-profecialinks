const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    transform: cleanUp,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const cookies = document.querySelector('span.tao_button_cookie_settings');
      if (cookies) cookies.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const bulletInfo = document.querySelectorAll('div.article_detail_text li');
      const descBulletInfo = [];
      if (bulletInfo) {
        bulletInfo.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('desc_bullets', descBulletInfo.join('||'));
      const descInfo = document.querySelectorAll('span[itemprop="description"] p');
      const descInfoArr = [];
      if (descInfo) {
        descInfo.forEach(e => {
          descInfoArr.push(e.innerText);
        });
      }
      addElementToDocument('desc_info', descInfoArr.join('||').replace(/\n/g, '||'));

      const inStockXpath = document.evaluate("//div[contains(@class, 'en_griditem')]/span[text()='In den Warenkorb'][contains(@class,'en_button--color_blue')]", document, null, XPathResult.STRING_TYPE, null);
      if (inStockXpath && inStockXpath.stringValue) {
        addElementToDocument('inStock', 'In Stock');
      }
      const colorXpath = document.evaluate("//span[@itemprop='description']/ul/li[contains(., 'Farbe')]", document, null, XPathResult.STRING_TYPE, null);
      if (colorXpath && colorXpath.stringValue) {
        addElementToDocument('productColor', colorXpath.stringValue.replace(/Farbe:\s(.+)$/g, '$1'));
      }
      const nameExtended = document.querySelector('meta[property="og:title"]');
      // @ts-ignore
      if (nameExtended && nameExtended.content) {
        // @ts-ignore
        const newNameExtended = nameExtended.content.replace(/,/, '');
        // @ts-ignore
        nameExtended.content = newNameExtended;
      }
    });

    await context.extract(productDetails, {transform: transformParam});
  },
};
