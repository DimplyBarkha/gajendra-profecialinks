const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    transform: cleanUp,
    domain: 'allbeauty.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        for (let j = 0; j < 36; j++) {
          // @ts-ignore
          document.getElementsByClassName("rankOrganic").remove();
        }
      }
      catch (err) {
      }
      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('page=')) {
          rankOrganic = checkPageNumber.replace('page=', '');
        }
      }
      catch (err) {
      }
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (parseInt(rankOrganic) * 36) + 1;
      }
      const urlProduct = document.querySelectorAll("div[class='list-item relative']");
      for (let i = 0; i < urlProduct.length; i++) {
        addElementToDocument('rankOrganic', rankOrganic++);
      }
      const ratings = document.querySelectorAll("div[class='ratings']");
      for (let k = 0; k < ratings.length; k++) {
        // @ts-ignore
        let singleRating = ratings[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1)
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addElementToDocument('aggregateRating', singleRating);
      }

    });
    return await context.extract(productDetails, { transform });
  },
};
