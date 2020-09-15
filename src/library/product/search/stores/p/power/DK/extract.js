const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'power',
    transform,
    domain: 'power.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const scrollBox = document.querySelector('body');
        const elemClick = scrollBox.querySelector('div#product-list-load-more button');
        let scrollTop = 0;
        while (scrollTop !== 30000 || elemClick) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (elemClick) elemClick.click();
          if (scrollTop === 30000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(() => {
      function addElementToDocument (elem, id, value) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = value;
        newDiv.style.display = 'none';
        elem.appendChild(newDiv);
      }
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const productsOnPage = document.querySelectorAll('div.product-container');
      const numberOfProductsOnPage = productsOnPage ? productsOnPage.length : 0;
      for (let i = 0; i < numberOfProductsOnPage; i++) {
        const item = document.querySelectorAll('div.product-container')
          ? document.querySelectorAll('div.product-container')[i] : [];
        // @ts-ignore
        console.log(item);
        const starsWidth = item && item.querySelector('div.stars-on[dataaverage]')
          // @ts-ignore
          ? item.querySelector('div.stars-on[dataaverage]') : '';
        console.log(starsWidth);
        const stars = starsWidth ? starsWidth.getAttribute('style') : '';
        console.log(stars);
        if (stars) {
          const aggRating = parseFloat(stars.replace(/width:\s([\d.]+)%;/g, '$1')) / 20;
          console.log(aggRating);
          addElementToDocument(item, 'aggRating', aggRating.toFixed(1));
        }
        addElementToDocument(item, 'pd_rank', lastProductPosition + i);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + numberOfProductsOnPage}`);
    });
    return await context.extract(productDetails);
  },
};
