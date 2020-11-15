const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content, container) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        container.appendChild(newDiv);
      };
      try {
        const ratings = document.querySelectorAll('.ProductCardVertical__meta');
        const containers = document.evaluate('//div[@class = "ProductCardCategoryList__grid"]//section/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        const productRatings = [];
        const productReviews = [];

        for (let i = 0; i < ratings.length; i++) {
          const rating = ratings[i].firstChild.firstChild.firstChild.firstChild.children[1].innerText;
          let reviewCount;
          if (ratings[i].children[1]) {
            reviewCount = ratings[i].children[1].firstChild.firstChild.firstChild.children[1].innerText;
          } else {
            reviewCount = 0;
          }
          productRatings.push(rating);
          productReviews.push(reviewCount);
        }
        productRatings.forEach((rating, index) => {
          addHiddenDiv('import_average_rating', rating, containers.snapshotItem(index));
          addHiddenDiv('import_review_count', productReviews[index], containers.snapshotItem(index));
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    });
    return await context.extract(data, { transform });
  },
};
