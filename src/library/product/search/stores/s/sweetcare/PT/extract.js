var { transform } = require("../format");

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(1000);
        scrollTop += 250;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
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
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  
  await context.evaluate(async function () {
    //@ts-ignore
    ajaxCall("/ajax/geralh.ashx?a=locationPreferences", pageLoad1)
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    //@ts-ignore
    document.querySelector("#country").value = "PT";
    //@ts-ignore
    document.querySelector("#currencySelect").value = "EUR";
    //@ts-ignore
    document.querySelector("#updatePreferencesButton").click();

    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul#searchItems li')[index];
      originalDiv.appendChild(newDiv);
    }
    const result = [];
    const product = document.querySelectorAll('ul#searchItems li');
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
    country: 'PT',
    store: 'sweetcare',
    transform,
    domain: 'sweetcare.pt',
    zipcode: '',
  },implementation
};
