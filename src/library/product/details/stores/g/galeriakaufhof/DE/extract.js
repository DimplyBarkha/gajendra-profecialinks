
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function findLabel (productObj, label) {
      const value = productObj[label];
      if (Array.isArray(value)) {
        return {
          label: value.reduce((prevVal, currentVal) => {
            return (prevVal) ? prevVal + ',' + currentVal : currentVal;
          }, ''),
        };
      } else if (value) {
        return { label: value };
      }
      return null;
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const jsonString2 = document.querySelector("div[class='pdp-main g-pds__main']");
    let jsonParsed = {};
      const abc=jsonString2.getAttribute('data-ga-track-product')
      const jsondata = JSON.parse(abc);
      const gtin = jsondata.variant;
      const brandText = jsondata.brand;
      // const availabilityText = jsondata.offers.availability;
      // const aggregateRating = jsondata.aggregateRating.ratingValue;
      addHiddenDiv('gtin', gtin);
      addHiddenDiv('brandText', brandText);
      // addHiddenDiv('availabilityText',availabilityText);
    });
    return await context.extract(productDetails, { transform });
  } 
const { cleanUp } = require('../../../../shared'); 
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'galeriakaufhof',
    transform: cleanUp,
    domain: 'galeria.de',
    zipcode: '',
  },
  implementation,
};
