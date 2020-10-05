const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform: cleanUp,
    domain: 'myntra.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
            await stall(1000);
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
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath (path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const bulletInfo1 = document.querySelectorAll('p.pdp-product-description-content li');
      const bulletInfo2 = document.querySelectorAll('ul.pdp-offers-offerDesc li div.pdp-offers-labelMarkup');
      const descBulletInfo = [''];
      if (bulletInfo1) {
        bulletInfo1.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      if (bulletInfo2) {
        bulletInfo2.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('desc_bullets', descBulletInfo.join(' || '));

      const data = document.querySelectorAll('script[type="application/ld+json"]');
      const json = data && data[1] && data[1].innerText ? JSON.parse(data[1].innerText) : '';
      if (json) {
        if (json.offers && json.offers.availability === 'InStock') {
          addElementToDocument('availability', 'In Stock');
        } else addElementToDocument('availability', 'Out of Stock');
        addElementToDocument('sku', json.sku);
        addElementToDocument('mpc', json.mpn);
      }

      const specsXpath = document.evaluate("//h4[contains(text(), 'pecifications')]/following-sibling::div[@class='index-tableContainer']/div[@class='index-row']", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (specsXpath) {
        let specsArr = [];
        for (let spec = specsXpath.iterateNext(); spec; spec = specsXpath.iterateNext()) {
          specsArr.push(spec.innerText);
        }
        addElementToDocument('specifications', specsArr.join(' || ').replace(/\s{2,}|\n/g, ' '));
      }

      const warranty = getElementByXpath('//p[@class="pdp-product-description-content"]/text()[position() = last()]')
        ? getElementByXpath('//p[@class="pdp-product-description-content"]/text()[position() = last()]').textContent : '';
      if (warranty.match('arranty')) addElementToDocument('warranty', warranty);
    });
    await context.extract(productDetails, { transform });
  },
};
