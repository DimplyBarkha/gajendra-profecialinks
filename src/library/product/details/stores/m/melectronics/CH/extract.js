const { transform } = require('../format.js')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      if (document.querySelector('img[alt="Video"]')) {
        document.querySelector('img[alt="Video"]').click();
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        await stall(3000);
        console.log(document.querySelector('#widget2').getAttribute('src'));
        let videoUrl=document.querySelector('#widget2').getAttribute('src');

        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
        addElementToDocument('videoLink', videoUrl);
        return document.querySelector('#widget2').getAttribute('src');
      }
    });
    
    await context.extract(productDetails);
  },
};
