const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const selectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    async function closeModal() {
      const modal = await selectorAvailable('gdpr-cookie-layer--show');
      console.log('modal!');
      if (modal) {
        console.log('modal!');
        const modalCloseButton = await selectorAvailable('button.gdpr-cookie-layer__btn--submit');
        if (modalCloseButton) {
          await context.click('button.gdpr-cookie-layer__btn--submit');
        }
      }
    }

    closeModal();

    await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
      //   document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
      // }

      if (document.querySelectorAll('li.thumb--play-video-btn').length) {
        const videosTiles = document.querySelectorAll('li.thumb--play-video-btn');
        const videos = [];
        [...videosTiles].forEach((element) => {
          const videoButton = element.querySelector('a');
          videoButton.click();
          const vidLink = getEleByXpath('//iframe[contains(@src,"youtube")]/@src');
          videos.push(vidLink);
          document.querySelector('.overlay-bg').click();
        });
        addHiddenDiv('ii_videos', videos.join(' || '));
      }
    });
    closeModal();
    await context.extract(productDetails, { transform });
  },
};
