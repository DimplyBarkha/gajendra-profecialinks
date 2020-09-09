const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: transform,
    domain: 'expert.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const product = document.querySelectorAll('div.product-item.is-clickable');
      for (let i = 0; i < product.length; i++) {
        const fullStar = product[i].querySelectorAll('svg[viewBox="0 0 46.773 44.751"]');
        const halfStar = product[i].querySelectorAll('svg[viewBox="0 0 46.773 44.75"]');
        let fullRating = null;
        if (fullStar.length === 5) {
          fullRating = '';
          const stars = product[i].querySelectorAll('svg[viewBox="0 0 46.773 44.751"]');
          let count = 1;
          while (count < stars.length) {
            if (!(stars[count - 1].isEqualNode(stars[count]))) {
              break;
            }
            count++;
          }
          fullRating = count;
        } else {
          if (halfStar) {
            const halfStarTotal = 0.5 * halfStar.length;
            fullRating = (5 - halfStarTotal);
          }
        }

        addElementToDocument(product[i], 'aggrRating', fullRating);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};

//     // function addElementToDocument (doc, key, value) {
//     //   const catElement = document.createElement('div');
//     //   catElement.id = key;
//     //   catElement.textContent = value;
//     //   catElement.style.display = 'none';
//     //   doc.appendChild(catElement);
//     // }
//     // const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
//     // const arr = document.querySelectorAll('div.category-products > ul > li:not([class="no-hover"])');
//     // for (let i = 0; i < arr.length; i++) {
//     //   addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
//     // }
