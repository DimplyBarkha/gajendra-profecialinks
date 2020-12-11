
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    transform: null,
    domain: 'vapordna.com',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      var button = document.querySelector('div#age-check-prompt button#submit_birthdate');
      button.click();
    });
    return await context.extract(productReviews);
  },
};