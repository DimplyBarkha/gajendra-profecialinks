const { transform } = require('../format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
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

    closePopUp();
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'traklin',
    transform,
    domain: 'traklin.co.il',
    zipcode: '',
  },
  implementation,
};
