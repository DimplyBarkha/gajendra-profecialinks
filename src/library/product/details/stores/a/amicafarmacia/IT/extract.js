const { transform } = require('./format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
    var loadReviewBtn = document.querySelector("#loadMore");
    while (loadReviewBtn!=null && loadReviewBtn.style.display != "none") {
      loadReviewBtn.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    transform,
    domain: 'amicafarmacia.com',
    zipcode: "''",
  },
  implementation
};
