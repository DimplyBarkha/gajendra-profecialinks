const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'babyjogger',
    transform,
    domain: 'babyjogger.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      let getAllImages = document.querySelectorAll('button.carousel-img-wrap img');
      let allImages = [];
      for (i = 0; i < getAllImages.length; i++) {
        allImages.push(getAllImages[i].getAttribute('src'));
      }
      let uniqueChars = [...new Set(allImages)];
      for (i = 0; i < uniqueChars.length; i++) {
        var div = document.createElement('div');
        div.className = 'secondaryimages';
        var getInput = document.createElement('input');
        div.appendChild(getInput);
        document.body.appendChild(div);
        getInput.setAttribute("value", uniqueChars[i]);
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};