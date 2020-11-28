const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    const images = document.querySelectorAll('.slick-track>div>img');
    let imageUrl;
    const categorySelector = document.querySelectorAll('.row.breadcrumbs-section>ol>li');
    let category;

    for (let j = 0; j < categorySelector.length; j++) {
      if (category !== null && category !== undefined) {
        category = categorySelector[j].textContent;
        category = category.replace('Zurück zu:', '');

        document.querySelectorAll('.row.breadcrumbs-section>ol>li')[j].setAttribute('category', category);
      }
    }

    let k = 0;

    for (let i = 0; i < images.length; i++) {
      imageUrl = images[i].src;

      if (imageUrl.includes('youtube.com')) {
        const urlProp = imageUrl.replace('.jpg', '');

        document.querySelectorAll('.media-wrapper.video-wrapper')[k].setAttribute('videoUrl', urlProp);
        k++;
      };
    };
  });

  await context.extract(productDetails, { transform }, 'MERGE_ROWS');
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform: cleanUp,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation,
};
