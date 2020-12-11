
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'VaporDNA',
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
      console.log('++++++++++++++++++++++++++++++++++++++')
      var button = document.querySelector('div#age-check-prompt button#submit_birthdate');
      button.click();
      console.log('-------------------')
      //console.log(p.querySelector('div.stamped-review-body>h3'));
    });

    return await context.extract(productReviews);
  },
};
