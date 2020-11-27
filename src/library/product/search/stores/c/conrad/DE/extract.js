
const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const policyAcceptPopup = await context.evaluate(function () {
    return !!document.evaluate('//div[@class="cmsCookieNotification__button cmsCookieNotification__button--accept"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup) {
    await context.click('.cmsCookieNotification__button--accept');
  }

  const policyAcceptPopup1 = await context.evaluate(function () {
    return !!document.evaluate('//li[@class="cmsHeaderMain__item cmsHeaderMain__item--settings"]//div[@class="cmsHeaderIdentificationPopup cmsHeaderIdentificationPopup--flyout div cmsIdentificationPopup__buttons"] //div[@class="cmsIdentificationPopup__button cmsIdentificationPopup__button__b2c"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup1) {
    await context.click('li.cmsHeaderMain__item.cmsHeaderMain__item--settings div.cmsHeaderIdentificationPopup.cmsHeaderIdentificationPopup--flyout div.cmsIdentificationPopup__buttons div.cmsIdentificationPopup__button.cmsIdentificationPopup__button__b2c');
  }
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(5000);
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
    const URL = window.location.href;
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('tr.contentRow')[index];
      originalDiv.appendChild(newDiv);
      console.log('child appended ' + index);
    }
    const product = document.querySelectorAll('tr.contentRow');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
    }
  });
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    transform: transform,
    domain: 'conrad.de',
    zipcode: '',
  },
  implementation,
};
