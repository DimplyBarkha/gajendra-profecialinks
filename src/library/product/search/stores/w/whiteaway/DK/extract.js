const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function showVisible() {
      for (let img of document.querySelectorAll('img')) {
        let realSrc = img.dataset.src;
        if (!realSrc) continue;
    
        if (isVisible(img)) {
          img.src = realSrc;
          img.dataset.src = '';
        }
      }
    }
    
    showVisible();
    window.onscroll = showVisible;
      // window.addEventListener('scroll', function() {
      //   document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
      // });
      await new Promise(r => setTimeout(r, 6000));
  }) 
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: transform,
    domain: 'whiteaway.com',
  },
  implementation,
};


// const { cleanUp } = require('../../../../shared');

// module.exports = {
//   implements: 'product/search/extract',
//   parameterValues: {
//     country: 'DK',
//     store: 'whiteaway',
//     transform: cleanUp,
//     domain: 'whiteaway.com',
//     zipcode: '',
//   },
// };

