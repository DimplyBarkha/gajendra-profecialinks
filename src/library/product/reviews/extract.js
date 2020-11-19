/**
 *
 * @param { { date: string, results: number} } inputs
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
  const { date, results } = inputs;
  const { transform } = parameters;
  let filterReviews = parameters.filterReviews;
  const { productReviews } = dependencies;
  // Adding current page url
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const currentPageUrl = window.location.href;

    const currentPageDiv = document.querySelector('#currentPageUrl');
    currentPageDiv ? currentPageDiv.textContent = currentPageUrl : addElementToDocument('currentPageUrl', currentPageUrl);
  });

  const data = await context.extract(productReviews, { transform });
  let stop = false;
  // Fiter out reviews in case reviews outside limit is present in the page.
  if (data && data[0]) {
    const filteredReivews = data[0].group.filter(review => {
      const reviewDate = new Date(review.reviewDate[0].text).setHours(0, 0, 0, 0);
      const dateLimit = new Date(new Date(date)).setHours(0, 0, 0, 0);
      return (reviewDate - dateLimit) >= 0;
    });
    if (filteredReivews.length < data[0].group.length) {
      stop = true;
    }
    if (results !== Infinity) {
      stop = false;
      filterReviews = false;
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
