const { transform } = require('../transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const cookieBtnOkSel = 'button[class*="CookieLayer-setUserCookiePermissions"]';
  let cookieBtnPresent = false;
  try {
    await context.waitForSelector(cookieBtnOkSel);
    console.log('got cookieBtnOkSel', cookieBtnOkSel);
    cookieBtnPresent = true;
  } catch(err) {
    console.log('got some error while waiting for cookie btn', err.message);
    try {
      await context.waitForSelector(cookieBtnOkSel);
      console.log('got cookieBtnOkSel', cookieBtnOkSel);
      cookieBtnPresent = true;
    } catch(error) {
      console.log('got some error while waiting for cookie btn, again', error.message);
    }
  }

  if(cookieBtnPresent) {
    await context.evaluate(async (cookieBtnOkSel) => {
      console.log('need to click cookieBtnOkSel', cookieBtnOkSel);
      let btnElm = document.querySelectorAll(cookieBtnOkSel);
      if(btnElm && btnElm.length > 0) {
        btnElm[0].click();
        console.log('clicked the btn');
      }
    }, cookieBtnOkSel);
    await new Promise(resolve => setTimeout(resolve, 4000));
  }

  async function addHiddenInfo (elementID, content) {
    await context.evaluate(function (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.id = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }, elementID, content);
  }
  const refererUrl = await context.evaluate(async function () {
    console.log(window.location.href);
    return window.location.href;
  });
  addHiddenInfo('ii_refererUrl', refererUrl);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation,
};
