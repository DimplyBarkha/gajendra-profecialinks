const { transform } = require('../format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // If URL is not available then sometimes listings page is loaded. Hence throwing error if listings page loads
  await context.evaluate(async function () {
    const productLoadedSelector = document.querySelector('div[class*="prod_wrap"]');
    const productLoadedFlag = !!productLoadedSelector;
    if (!productLoadedFlag) {
      throw new Error('Poduct page cannot be loaded....');
    }
  });

  await context.evaluate(async function () {
    // Function to get a deeply nested object's value
    const getObjVal = (p, o) =>
      p.reduce((xs, x) => {
        return (xs && xs[x]) ? xs[x] : null;
      }, o);

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to close the pop up if it appears on the website
    function closePopUp () {
      const popUpSelector = document.querySelector('div[id*="CLOSE_BUTTON_6_CONT"]');
      popUpSelector && popUpSelector.click();
    }

    // Function to fetch sku from window object
    function fetchSkuFromWindow () {
      const sku = getObjVal(['ecommerce', 'detail', 'products', 0, 'id'], window.dataLayer[0]);
      addHiddenDiv('added_sku', sku);
    }

    closePopUp();
    fetchSkuFromWindow();
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'traklin',
    transform,
    domain: 'traklin.co.il',
    zipcode: '',
  },
  implementation,
};
