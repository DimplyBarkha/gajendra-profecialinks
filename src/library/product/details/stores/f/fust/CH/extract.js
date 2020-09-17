const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const availabilitySelector = 'div[class="availabilityBox n-availabilityBox"] div[class*="availability stati"]';
    await context.evaluate((availabilitySelector) => {
      let stockText = '';
      const availabilityStatus = document.querySelector(availabilitySelector).innerText;
      if (availabilityStatus.includes('sofort lieferbar')) { stockText = 'In Stock'; } else if (availabilityStatus.includes('innert 1-2 Wochen')) { stockText = 'In Stock'; } else if (availabilityStatus.includes('momentan nicht kaufbar')) { stockText = 'Out Of Stock'; } else if (availabilityStatus.includes('Lieferung ab')) { stockText = 'Out Of Stock'; } else if (availabilityStatus.includes('Liefertermin nicht')) {
        const regionalAvailability = 'div[class*="filialeAvailability stati"]';
        const regionalAvailabilityStatus = document.querySelector(regionalAvailability).innerText;
        if (regionalAvailabilityStatus.includes('momentan nicht kaufbar')) { stockText = 'Out Of Stock'; } else { stockText = 'In Stock'; }
      }
      document.body.setAttribute('availability', stockText);
    }, availabilitySelector);

    return await context.extract(productDetails, { transform });
  },
};
