async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  await context.evaluate(async () => {
    const reviews = [];
    const reviews2 = document.querySelectorAll('li.bv-content-item');
    console.log(reviews2);
    reviews.push(...reviews2);
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    console.log('reviews ', reviews);
  });
  await context.click('li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next > a', {}, { timeout: 4000 });
  await new Promise((resolve, reject) => setTimeout(resolve, 4000));

  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: null,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation,
};
