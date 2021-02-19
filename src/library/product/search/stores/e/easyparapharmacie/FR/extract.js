// @ts-nocheck
const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const waitForResults = async (prevResultsNum) => {
      let resultsNum = document.querySelectorAll('div.product-container').length;
      let iteration = 0;
      while (prevResultsNum === resultsNum && iteration < 10) {
        console.log(`Prev results: ${prevResultsNum}`);
        console.log(`Results now: ${resultsNum}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        resultsNum = document.querySelectorAll('div.product-container').length;
        iteration++;
      }
    };

    let buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
    if (buttonShowMore) {
      let totalProducts = document.querySelectorAll('div.product-container').length;
      // There are 2 extractors here, because IM search needs 1000 results and
      // there's no way to pass 'results' input to extract.js
      // For IM search uncomment/comment 2 lines below
      // while (totalProducts < 1000 && !buttonShowMore.disabled) {
      while (totalProducts < 150 && !buttonShowMore.disabled) {
        buttonShowMore.click();
        await waitForResults(totalProducts);
        totalProducts = document.querySelectorAll('div.product-container').length;
        buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
      }

      // let counter = 0;
      // const resultsPerPage = 24;
      // // We add here 1000 because this is what IM search requires, and so far
      // // there's no way to pass inputs to extract.js
      // // const maxResultsForExtractor = 150 - resultsPerPage;
      // const maxResultsForExtractor = 1000 - resultsPerPage;
      // do {
      //   if (Math.floor(maxResultsForExtractor / resultsPerPage) <= counter) {
      //     break;
      //   }
      //   buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
      //   // @ts-ignore
      //   buttonShowMore.click();
      //   await stall(1000);
      //   counter++;
      //   // @ts-ignore
      // } while (buttonShowMore.disabled === false);
    }
  });

  await context.evaluate(async function () {
    const addDiv = (className, content, productDiv) => {
      const newDiv = document.createElement('div');
      // @ts-ignore
      newDiv.classList.add(className);
      newDiv.innerHTML = content;
      // @ts-ignore
      productDiv.appendChild(newDiv);
    };

    const allProducts = document.querySelectorAll('div.product-container');
    allProducts.forEach((product) => {
      let rating;
      const aggregateRating = product.querySelector('div.ratings > div.rating-box');
      if (aggregateRating.children.length > 0) {
        const ratingChild = aggregateRating.children[0];
        // @ts-ignore
        const width = ratingChild.style.width;
        // @ts-ignore
        const numberFromWidth = width.match(/\d+/);
        const ratingWithPoint = numberFromWidth / 20;
        const ratingAsString = ratingWithPoint.toString();
        rating = ratingAsString.replace('.', ',');
      } else {
        rating = '';
      }
      addDiv('aggregateRating', rating, product);

      const ratingCountNum = product.querySelector('div.ratings > span').innerHTML;
      const ratingCount = ratingCountNum.match(/\d+/);
      addDiv('ratingCount', ratingCount, product);
    });
  });
  const addSearchUrl = async function (context) {
    await context.evaluate(async () => {
      const productList = document.querySelectorAll('.products-list div[class="products small-product"]');
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    transform,
    domain: 'easyparapharmacie.com',
    zipcode: '',
  },
  implementation,
};
