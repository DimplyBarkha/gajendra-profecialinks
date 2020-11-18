const { transform } = require("./transform");

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  const userCompany = await context.evaluate(function () {
    return document.querySelector('span#user-company').innerText;
  });
  // console.log('userCompany', userCompany);
  if (userCompany.indexOf('SUPPLIER') === -1) {
    await context.goto('https://www.deebee.co.uk/account/logon', {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.waitForNavigation({ waitUntil: 'load' });

    await context.setInputValue('#custname', 'S00001');
    await context.setInputValue('#custpass', 'supplier');

    // document.querySelector('div.login-details input.input-login').click();
    await context.click('form[action="https://www.deebee.co.uk/account/logon"] button[type="submit"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.goto(mainUrl, {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
  }
  const dialogButtonClose = await context.evaluate(function () {
    return document.querySelector('button.ui-dialog-titlebar-close')
  });
  if (dialogButtonClose) {
    await context.click('button.ui-dialog-titlebar-close');
  }
  await context.waitForNavigation({ waitUntil: 'load' });
  await context.evaluate(async function () {

    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('.hproduct')[index];
      originalDiv.appendChild(newDiv);
      console.log("child appended " + index);
    }
    const result = [];
    const product = document.querySelectorAll('.hproduct');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
    }
    return result;
  });
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'deebee',
    transform,
    domain: 'deebee.co.uk',
    zipcode: '',
  },
  implementation
};