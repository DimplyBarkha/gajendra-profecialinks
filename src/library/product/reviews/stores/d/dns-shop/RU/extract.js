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
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const ratingSelector = document.querySelectorAll('div.ow-opinion__rating span.star-rating__star');
    if (ratingSelector) {
      let isSelected;
      const ratingArr = [];
      for (let i = 0; i < 5; i++) {
        if (ratingSelector[i]) { isSelected = ratingSelector[i].getAttribute('data-state'); }
        if (isSelected === 'selected') { ratingArr.push(1); } else ratingArr.push(0);
      }
      const rating = ratingArr.reduce(function (a, b) {
        return a + b;
      }, 0);
      addHiddenDiv('aggregateRating', rating);
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
