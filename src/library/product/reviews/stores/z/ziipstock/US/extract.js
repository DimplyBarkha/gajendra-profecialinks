
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    transform: null,
    domain: 'ziipstock.com',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;

    await context.evaluate(async () => {
      console.log('++++++++++++++++++++++++++++++++++++++')
      var p = document.querySelector('div.stamped-review');
      console.log(p.querySelector('div.stamped-review-body>h3'));
    });

    return await context.extract(productReviews);
  },
};
