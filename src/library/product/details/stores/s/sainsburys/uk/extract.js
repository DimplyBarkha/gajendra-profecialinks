
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
    const jsonString = document.querySelector("script[type='application/ld+json']").innerText;
    let jsonParsed = {};
    if (jsonString && jsonString.trim()) {
      jsonParsed = JSON.parse(jsonString);
    // let availabilityText= jsonParsed["offers"].availability
    //   addHiddenDiv('availabilityText', availabilityText);
      }
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      const availabilityText = jsondata.offers.availability;
      // const aggregateRating = jsondata.aggregateRating.ratingValue;
      addHiddenDiv('gtin', gtin,);
      addHiddenDiv('availabilityText',availabilityText);
    });
    return await context.extract(productDetails, { transform });
  } 
const { cleanUp } = require('../../../../shared'); 
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: cleanUp,
    domain: 'sainsburys.co.uk',
    zipcode: '',
  },
  implementation,
};
