async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    let category = document.querySelector('.row.breadcrumbs-section').textContent;
    const categoryItereation = category.split('Zurück zu:');
    category = '';

    categoryItereation.forEach(element => {
      category += element + '>';
    });

    document.querySelector('.row.breadcrumbs-section').setAttribute('category', category);
  });

  await context.evaluate(() => {
    const images = document.querySelectorAll('.slick-track>div>img');
    let imageUrl;
    let j = 0;
    for (let i = 0; i < images.length; i++) {
      imageUrl = images[i].src;

      if (imageUrl.includes('youtube.com')) {
        const urlProp = imageUrl.replace('.jpg', '');

        document.querySelectorAll('.media-wrapper.video-wrapper')[j].setAttribute('videoUrl', urlProp);
        j++;
      };
    };
  });

  await context.extract(productDetails);
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform: null,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation,
};
