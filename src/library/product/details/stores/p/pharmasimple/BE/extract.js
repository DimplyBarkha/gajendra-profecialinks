const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    // Add quantity
    const title = document.querySelector('h1[itemprop="name"]')
      ? document.querySelector('h1[itemprop="name"]').textContent
      : null;
    if (title) {
      const regExp = /\d+\s?\w+/g;
      const quantity = [...title.matchAll(regExp)];

      if (quantity) {
        addElementToDom(quantity.pop(), 'quantity');
      }
    }

    // filter breadcrumbs
    const breadcrumps = document.querySelectorAll(
      'div[class="breadcrumb clearfix"] a');
    breadcrumps.forEach((element, index) => {
      if (index > 0) {
        element.setAttribute('category', element.textContent);
      }
    });

    // Convert rating
    var rating = document.querySelector('span[class="ratingValue"]');
    if (rating) {
      rating.setAttribute(
        'rating',
        rating.textContent.replace('.', ','));
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    transform: transform,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
  implementation,
};
