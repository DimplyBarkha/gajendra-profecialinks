const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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

    // Specifications
    const specsArrSelector = document.querySelectorAll('table.skuTechSpecsTable tr');
    if (specsArrSelector) {
      const specsArr = [];
      for (let i = 0; i < specsArrSelector.length; i++) {
        specsArr.push(specsArrSelector[i].querySelector('th.techSpecsHeading').innerText + ': ' + specsArrSelector[i].querySelector('td.techSpecsValue').innerText);
      }
      addHiddenDiv('specsArr', specsArr.join('|| '));
    }

    // Aggregate rating
    const ratingSelector = document.querySelectorAll('div.tpw-stars-part div.tpw-stars-small div');
    if (ratingSelector) {
      const ratingArr = [];
      for (let i = 0; i < ratingSelector.length; i++) {
        if (ratingSelector[i].getAttribute('class') === 'tpw-star tpw-star-full') ratingArr.push(1); else ratingArr.push(0);
      }
      const aggregateRating = ratingArr.reduce(function (a, b) {
        return a + b;
      }, 0);
      addHiddenDiv('aggregateRating', aggregateRating);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'officedepot',
    transform,
    domain: 'officedepot.fr',
    zipcode: '',
  },
  implementation,
};
