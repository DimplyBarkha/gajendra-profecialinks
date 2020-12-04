const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, mergeType } = parameters;
  const { productReviews } = dependencies;
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

    const breadcrumbs = document.querySelectorAll('ul.breadcrumb li');
    if (breadcrumbs) {
      addElementToDocument('my-product-range', breadcrumbs[breadcrumbs.length - 2].textContent);
    }
  });

  console.log(`mergeType: ${mergeType}`);
  const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
  const data = await context.extract(productReviews, mergeOptions);

  return { data };
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    transform,
    filterReviews: null,
    domain: 'logicvapes.us',
    zipcode: '',
  },
  implementation,
};
