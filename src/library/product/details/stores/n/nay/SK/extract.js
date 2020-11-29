
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    transform: null,
    domain: 'nay.sk',
    zipcode: '',
  },

  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
    // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      // const dataObj = window.dataLayer[0].product;
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv (node, id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        node.appendChild(newDiv);
      }
      const aggregateRating = document.querySelectorAll('#lb-results > div > div > ul > li > div > div > a > div > p > span > span');
      for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1);
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
      }
      const itemContainers = document.querySelectorAll('#lb-results > div > div > ul > li');
      let rank = 1;
      for (const itemContainer of itemContainers) {
        console.log(itemContainer);
        const totalRank = itemContainer + rank;
        addHiddenDiv(itemContainer, 'rank', totalRank);
        rank++;
      }
      // @ts-ignore
      const mainDataObj = window.dataLayer[6].ecommerce.detail.products[0].dimension14;
      if (mainDataObj) {
        addElementToDocument('pd_variantId', mainDataObj);
      }
      // await context.waitForXPath("//a[@class='product-top__main-image-link img-box compare-add-img']/img[@class='img-box__img js-lazy js-only jsOnly product-top__main-image compare-img js-lazy--loaded']/@src | //a[@class='product-top__main-image-link img-box compare-add-img']/img[@class='img-box__img js-lazy js-only jsOnly product-top__main-image compare-img js-lazy--loaded']/@src | //a[@class='product-top__main-image-link img-box compare-add-img js-pdbox']/img[@class='img-box__img js-lazy js-only jsOnly product-top__main-image compare-img js-lazy--loaded']/@src");
      await stall(7000);
      const image = document.querySelector('#product-main-img > a > img').getAttribute('src');
      console.log(image);
      if (image) {
        addElementToDocument('image', image);
      }
    });
    await context.extract(productDetails);
  },
};
