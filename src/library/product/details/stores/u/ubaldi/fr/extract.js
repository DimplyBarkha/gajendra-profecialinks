
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'fr',
    store: 'ubaldi',
    transform: transform,
    domain: 'ubaldi.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // await context.waitForSelector('#flix-iframe0', { timeout: 10000 });
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const colorlement = document.evaluate("//div[contains(@class,'fa-liste-decli')]//*/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        const colorCode = colorlement.value.match(/\d+/g);
        addElementToDocument('fl_colorcode', colorCode);
      }

      async function collectVideo () {
        const secret = await context.evaluate(function () {
          const ele = document.querySelector('video');
          if (ele) {
            const eleSrc = ele.getAttribute('src');
            console.log('RETURNING SOURCE');
            return eleSrc;
          } else {
            return 'COULD NOT FIND!!!!!!!!!!!!!!!!!!!!';
          }
        }, [], 'iframe[title="Flix-media-video-0"]');
        console.log(secret);
      }
      collectVideo();
    });
    await context.extract(productDetails);
  },
};
