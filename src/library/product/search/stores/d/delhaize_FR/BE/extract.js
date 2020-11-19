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
    return !!document.evaluate('//button[contains(@class, "js-cookies-accept-all")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup) {
    await context.click('button.js-cookies-accept-all');
  }

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 15000) {
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
  await applyScroll(context);

  await context.evaluate(async function () {
    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul.ProductList li.data-item')[index];
      originalDiv.appendChild(newDiv);
      console.log("child appended " + index);
    }
    const product = document.querySelectorAll('ul.ProductList li.data-item');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      let pageNumber = product[i].getAttribute("data-page-number");
      console.log("Data page number = "+pageNumber)
      if(URL.includes("pageNumber")) {
        URL = URL.replace(/pageNumber=(\d+)/, "pageNumber="+pageNumber);
      }
      addHiddenDiv('page_url', URL, i);
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_FR',
    transform: transform,
    domain: 'delhaize_FR.be',
    zipcode: '',
  },
  implementation
};
