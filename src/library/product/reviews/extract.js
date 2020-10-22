/**
 *
 * @param { { date: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { date } = inputs;
  const { transform, filterReviews } = parameters;
  const { productReviews } = dependencies;
  const data = await context.extract(productReviews, { transform });
  let stop = false;
  // Fiter out reviews in case reviews outside limit is present in the page.
  if (data) {
    const filteredReivews = data[0].group.filter(review => {
      const reviewDate = new Date(review.reviewDate[0].text).setHours(0, 0, 0, 0);
      const dateLimit = new Date(Number(date)).setHours(0, 0, 0, 0);
      return (reviewDate - dateLimit) >= 0;
    });
    if (filteredReivews.length < data[0].group.length) {
      stop = true;
    }
    if (filterReviews) {
      data[0].group = filteredReivews;
    }
  }
  return { data, stop };
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
    {
      name: 'filterReviews',
      description: 'Boolean (true or false), filters out reviews outside given date.',
      optional: true,
    },
  ],
  inputs: [
  ],
  dependencies: {
    productReviews: 'extraction:product/reviews/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
