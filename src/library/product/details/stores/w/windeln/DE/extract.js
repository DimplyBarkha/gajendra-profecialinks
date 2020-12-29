const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    const images = document.querySelectorAll('.slick-track>div>img');
    let imageUrl;
    const categorySelector = document.querySelectorAll('.row.breadcrumbs-section>ol>li');
    let category;

    let ratingPresentSelector = document.querySelector('span[itemprop="ratingValue"]');
    let ratingAbsentSelector = document.querySelector('.ratings-list-no-ratings');

    if (ratingAbsentSelector !== null) {
      ratingAbsentSelector = 'Noch keine Bewertungen.';

      document.querySelector('.selection-separation-line').setAttribute('rating', ratingAbsentSelector);
    }

    if (ratingPresentSelector !== null) {
      ratingPresentSelector = ratingPresentSelector.textContent.replace('.', ',');

      document.querySelector('.selection-separation-line').setAttribute('rating', ratingPresentSelector);
    }

    for (let j = 1; j < categorySelector.length; j++) {
      if (categorySelector[j] !== null && categorySelector[j] !== undefined) {
        category = categorySelector[j].textContent;
        category = category.replace('Zurück zu:', '');

        if (categorySelector[j + 1] !== undefined) {
          document.querySelectorAll('.row.breadcrumbs-section>ol>li')[j].setAttribute('category', category);
        }
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
