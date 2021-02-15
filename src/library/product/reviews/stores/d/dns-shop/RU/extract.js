async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  const currentUrl = await context.evaluate(async function () {
    const currentUrl = window.location.href;
    return currentUrl;
  });
  await context.goto(`${currentUrl}opinion/`);

  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parent) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      parent.appendChild(newDiv);
    }

    while (document.querySelector('div[style*="display: flex"] a[data-role="more"]')) {
      document.querySelector('a[data-role="more"]').click();
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const reviewSelector = document.querySelectorAll('div.ow-opinion__rating');
    for (let j = 0; j < reviewSelector.length; j++) {
      console.log('j: ', j);
      const parent = document.querySelectorAll('div.ow-opinions__item')[j];
      const ratingSelector = reviewSelector[j].querySelectorAll('.star-rating__star');
      if (ratingSelector) {
        let isSelected;
        const ratingArr = [];
        for (let i = 0; i < 5; i++) {
          console.log('i: ', i);
          if (ratingSelector[i]) { isSelected = ratingSelector[i].getAttribute('data-state'); }
          if (isSelected === 'selected') { ratingArr.push(1); } else ratingArr.push(0);
        }
        const rating = ratingArr.reduce(function (a, b) {
          return a + b;
        }, 0);
        addHiddenDiv(`aggregateRating${j}`, rating, parent);
      }
    }
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform: null,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
  implementation,
};
