const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // function addElementToDom (element, id) {
    //   const div = document.createElement('div');
    //   div.id = id;
    //   div.innerHTML = element;
    //   document.body.appendChild(div);
    // }

    // Add quantity
    // const title = document.querySelector('h1[itemprop="name"]')
    //   ? document.querySelector('h1[itemprop="name"]').textContent
    //   : null;
    // if (title) {
    //   const regExp = /\d+\s?\w+/g;
    //   const quantity = [...title.matchAll(regExp)];

    //   if (quantity) {
    //     addElementToDom(quantity.pop(), 'quantity');
    //   }
    // }

    // url
    const url = window.location.href;
    document.querySelector('body').setAttribute('url', url);

    // filter breadcrumbs
    const breadcrumps = document.querySelectorAll('div[class="breadcrumb clearfix"] a');
    breadcrumps.forEach((element, index) => {
      if (index > 0) {
        element.setAttribute('category', element.textContent);
      }
    });

    // Convert rating
    var rating = document.querySelector('span[class="ratingValue"]');
    if (rating) {
      rating.setAttribute('rating', rating.textContent.replace('.', ','));
    }
  });

  const extractedData = await context.extract(productDetails, { transform });

  const availability = extractedData[0].group[0].availabilityText;
  if (availability) {
    availability[0].text = availability[0].text.includes('InStock') ? 'In stock' : 'Out of stock';
  }

  return extractedData;
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    transform: cleanUp,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
  implementation,
};
