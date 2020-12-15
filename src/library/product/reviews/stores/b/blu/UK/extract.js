
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    transform: null,
    domain: 'blu.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      const popUps = document.querySelector('[data-testid="age-wall-button-accept"]');
      if (popUps) {
        document.getElementById('check').click();
        popUps.click();
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });
      }
    });
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
    return await context.extract(productReviews);
  },
};
