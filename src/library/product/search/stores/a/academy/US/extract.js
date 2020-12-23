const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'academy',
    transform: transform,
    domain: 'academy.com',
    zipcode: '',
  },

  // implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
  //   //
  //   async function addUrl () {
  //     function addHiddenDiv (id, content) {
  //       const newDiv = document.createElement('div');
  //       newDiv.id = id;
  //       newDiv.textContent = content;
  //       newDiv.style.display = 'none';
  //       document.body.appendChild(newDiv);
  //     }
  //     const url = window.location.href;
  //     addHiddenDiv('added-searchurl', url);
  //   }
  //   await context.evaluate(addUrl);
  // },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function addUrl () {
      const aggregateRating = document.querySelectorAll('div.css-17055y5');
      for (let k = 0; k < aggregateRating.length; k++) {
        // @ts-ignore
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1);
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addHiddenDiv('added_aggregateRating', singleRating, k);
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 15000) {
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
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        if (index === 'url') {
          document.body.appendChild(newDiv);
        } else {
          const originalDiv = document.querySelectorAll('div.horizontal div.css-17055y5')[index];
          // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
          originalDiv.appendChild(newDiv);
        }
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url, 'url');
      // if (document.querySelector('#added-searchurl') !== null) {
      //   document.querySelector('#added-searchurl').innerHTML = url;
      // } else {
      //   addHiddenDiv('added-searchurl', url);
      // }
    }
    // async function testDiv () {
    //   // const newDiv = document.createElement('div');
    //   // newDiv.id = id;
    //   // newDiv.innerHTML = content;
    //   // newDiv.style.display = 'none';
    //   // document.body.appendChild(newDiv);
    //   console.log('----------------------------------');
    //   console.log(this);
    // }
    // await context.evaluate(testDiv);
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
