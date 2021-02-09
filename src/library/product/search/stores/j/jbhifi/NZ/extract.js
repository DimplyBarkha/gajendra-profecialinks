const { transform } = require('./../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { results, keywords } = inputs;
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const cssInputCol = '#alSearchProducts';
  const cssProductCard = "div[class*='span03 product-tile ng-scope']";

  await context.setInputValue(cssInputCol, keywords);
  try {
    await context.waitForSelector(cssProductCard, { timeout: 10000 });
  } catch (error) {
    console.log('Products not loaded, css => ', cssProductCard);
  }

  await context.evaluate(async function (results, cssProductCard) {
    const totalProducts = document.querySelector('.total-results')
      && document.querySelector('.total-results').innerText
      && document.querySelector('.total-results').innerText.match(/\d+/g)[0];
    
    const cssScrollParent = '.search-contain';

    async function infiniteScroll(results, totalProducts, cssScrollParent, cssProductCard) {
      console.log('Results expected::', results);
      let prevScroll = document.querySelector(cssScrollParent).scrollTop;
      let count = 1;
      let productsLength = document.querySelector(cssProductCard) ? document.querySelectorAll(cssProductCard).length : 0;
      while ((productsLength <= results) && (productsLength <= totalProducts)) {
        console.log('Srolling', count++);
        productsLength = document.querySelector(cssProductCard) ? document.querySelectorAll(cssProductCard).length : productsLength;

        document.querySelector(cssScrollParent).scrollTop += 1500;
        console.log('Previous Products count', productsLength);

        // wait some time, because products take time to load
        await new Promise(resolve => setTimeout(resolve, 500));

        const currentProductLength = document.querySelector(cssProductCard) ? document.querySelectorAll(cssProductCard).length : 0;
        console.log('Current Products count', currentProductLength);
        const currentScroll = document.querySelector(cssScrollParent).scrollTop;

        // break when desired count is loaded
        if(currentProductLength >= results || currentProductLength >= totalProducts) {
          console.log('Required count of products loaded');
          console.log('currentProductLength: ', currentProductLength);
          break;
        }

        // sometimes we are scrolled till bottom still all the products are not loaded, so we want to scroll reverse by some px
        if(currentProductLength <= results && currentProductLength < totalProducts) {
          const scrollReverseBy = 500;
          console.log('Scrolling in reverse order by: ', scrollReverseBy);
          document.querySelector(cssScrollParent).scroll({
            top: (currentScroll-scrollReverseBy), 
            left: 0, 
            behavior: 'smooth'
          });
        }
        
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll(results, totalProducts, cssScrollParent, cssProductCard);

    const url = window.location.href;
    console.log('url', window.location.href);
    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;
    document.body.appendChild(searchUrlDiv);
  }, results, cssProductCard);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.co.nz',
    zipcode: '',
  },
  implementation,
};
