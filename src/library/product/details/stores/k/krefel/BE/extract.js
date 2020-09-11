
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    transform: cleanUp,
    domain: 'krefel.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const scriptWithInfo = document.evaluate("//script[contains(text(), 'availability')]", document, null, XPathResult.STRING_TYPE, null);
      const regexAvailability = /"availability":\s"([A-z]+)"/g;
      const regexRating = /"ratingValue":\s"([\d,]+)"/g;
      const foundAvailability = regexAvailability.exec(scriptWithInfo.stringValue);
      const foundRatingValue = regexRating.exec(scriptWithInfo.stringValue);
      if (foundAvailability) {
        document.body.setAttribute('availability', foundAvailability[1]);
      }
      if (foundRatingValue) {
        document.body.setAttribute('ratingValue', foundRatingValue[1].replace(',', '.'));
      }
    });
    await context.extract(productDetails);
  },
};
