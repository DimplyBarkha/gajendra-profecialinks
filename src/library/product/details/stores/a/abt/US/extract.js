const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'abt',
    transform: cleanUp,
    domain: 'abt.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const tabs = document.querySelectorAll('ul#product-tabs>li>a');
      if (tabs) {
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].click();
          await timeout(3000);
        }
      }
      const specification = document.querySelector('div#specifications_content tr')
        // @ts-ignore
        ? document.querySelector('div#specifications_content tr').innerText : '';
      if (specification) {
        addElementToDocument('specification', specification.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }
      const bulletInfo = document.querySelectorAll('div#overview_content td ul li');
      const keyFeatures = document.querySelectorAll('ul#key_features li');
      const descBulletInfo = [];
      keyFeatures.forEach(e => {
        descBulletInfo.push(e.innerText);
      });
      bulletInfo.forEach(e => {
        descBulletInfo.push(e.innerText);
      });
      addElementToDocument('descBulletInfo', descBulletInfo.join('||'));
      const availablility = document.querySelector('button.addToCart.green_button') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availablility', availablility);
      const shippingInfo = document.querySelector('button.addToCart.green_button')
        ? 'Ships from and sold by abt.com' : '';
      addElementToDocument('shippingInfo', shippingInfo);

      const variants = document.querySelector('div.display-group-color');
      const variantColor = variants && document.querySelector('div.display-group-color strong')
        // @ts-ignore
        ? document.querySelector('div.display-group-color strong').innerText : '';
      const specColorXpath = document.evaluate('//table[@id="specs_table"]//strong[text()="Color"]/../following-sibling::td[1]', document, null, XPathResult.STRING_TYPE, null);
      const specColor = specColorXpath ? specColorXpath.stringValue : '';
      const descColorXpath = document.evaluate('//li[strong[text()="Color:"]]/text()', document, null, XPathResult.STRING_TYPE, null);
      const descColor = descColorXpath ? descColorXpath.stringValue : '';
      if (variantColor) {
        addElementToDocument('color', variantColor);
      } else if (specColor) {
        addElementToDocument('color', specColor);
      } else {
        addElementToDocument('color', descColor);
      }
      const pdfExist = document.querySelector('div#documents_content ul li');
      if (pdfExist) addElementToDocument('pdfExist', 'Yes');
      const manufacturerDescription = document.querySelector('div#from_manufacturer_content')
        ? document.querySelector('div#from_manufacturer_content').innerText.replace(/\n{2,}|\s{2,}/g, '') : '';
      if (manufacturerDescription) addElementToDocument('manufacturerDescription', manufacturerDescription);
      const iframes = document.querySelectorAll('iframe[title="Product Videos"]');
      if (iframes) {
        iframes.forEach(el =>
          addElementToDocument('video', `${el.contentDocument.querySelector('video').getAttribute('src')}`));
      }
    });
    await context.extract(productDetails);
  },
};
