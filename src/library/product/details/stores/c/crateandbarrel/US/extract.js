const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const policyAcceptPopup = await context.evaluate(function () {
    return !!document.evaluate('//div[@id="tinycontent"]//a[@id="closeButton"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup) {
    await context.click('div#tinycontent a#closeButton');
  }

  /*await context.evaluate(async function () {
    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div#bodyContainer')[index];
      originalDiv.appendChild(newDiv);
      
    }
    console.log('child will be appended');
    const product = document.querySelectorAll('div#bodyContainer');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
    }
  });
*/
  var variantUrls = await context.evaluate(async function () {
    const result = [];
    (document.querySelectorAll('div.hidden a')).forEach((elem) => {
      result.push({
        url: `https://www.crateandbarrel.com${elem.getAttribute('href')}`,
      });
    });
    return result;
  });
  console.log("variant length == " + variantUrls.length);
  if (variantUrls.length > 1) {
    // await preparePageForCommonElement(0, variantLength);
    for (let j = 0; j < variantUrls.length; j++) {
      await context.goto(variantUrls[j].url, {
        timeout: 300000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      const policyAcceptPopup = await context.evaluate(function () {
        return !!document.evaluate('//div[@id="tinycontent"]//a[@id="closeButton"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      });
      if (policyAcceptPopup) {
        await context.click('div#tinycontent a#closeButton');
      }
      await context.waitForSelector('div.availability-wrapper, div.dimension-content');
      await context.evaluate(async function (url) {
        const newDiv = document.createElement('div');
        newDiv.id = 'page_url';
        newDiv.textContent = url;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelector('div#bodyContainer');
        originalDiv.appendChild(newDiv);
      }, variantUrls[j].url);
      // await context.click(`ul.topic li label`);
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantUrls.length - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    transform: transform,
    domain: 'crateandbarrel.com',
    zipcode: '',
  }, implementation,
};
