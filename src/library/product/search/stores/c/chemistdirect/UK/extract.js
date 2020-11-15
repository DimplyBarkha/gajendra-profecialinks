var { transform } = require('../format');

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
      GlobalE.ShippingSwitcher.Show()
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      var gle_selectedCountry = document.querySelector("#gle_selectedCountry");
      gle_selectedCountry.value = "GB";
      GlobalE.ShippingSwitcher.SaveAndClose();
    

    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('li.cd-p-item')[index];
      originalDiv.appendChild(newDiv);
      console.log("child appended " + index);
    }
    const result = [];
    const product = document.querySelectorAll('li.cd-p-item');
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
    store: 'chemistdirect',
    transform,
    domain: 'chemistdirect.co.uk',
    zipcode: '',
  },implementation
};
