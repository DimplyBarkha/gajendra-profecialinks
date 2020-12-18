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
    const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
    const jsondata = JSON.parse(rawdata);
    // const gtin = jsondata.gtin13;
    const availabilityText = jsondata.offers.availability;
    const price= jsondata.offers.price;
    const aggregateRating = jsondata.review.reviewRating.ratingValue;
    const brand = jsondata.brand.name;
    // addHiddenDiv('gtin', gtin,);
    addHiddenDiv('availabilityText',availabilityText);
    addHiddenDiv('aggregateRating', aggregateRating,);
    addHiddenDiv('brandText',brand,);
  });
  return await context.extract(productDetails, { transform });
  } 
  const { transform } = require('../../../../shared'); 
  module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
      country: 'uk',
      store: 'sainsburys',
      transform: transform,
      domain: 'sainsburys.co.uk',
      zipcode: '',
    },
    implementation,
  };