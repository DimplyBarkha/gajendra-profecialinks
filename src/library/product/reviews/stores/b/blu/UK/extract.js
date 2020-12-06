
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
      console.log('++++++++++++++++++++++++++++++++++++++')
      const popUps = document.querySelector('[data-testid="age-wall-button-accept"]');
      if (popUps){
        document.getElementById('check').click();
        popUps.click();
        console.log('==================================')
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
      }, 2000);
    });
    return await context.extract(productReviews);
  },
};
