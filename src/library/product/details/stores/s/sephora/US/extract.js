const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    const variantArray = await context.evaluate(function (parentInput) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv(`ii_url`, window.location.href);
      addHiddenDiv(`ii_parentInput`, parentInput);

      let scrollTop = 0;
      while (scrollTop !== 10000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
  
        console.log("SCROLLING")
        if (scrollTop === 10000) {
          break;
        }
      }

      let flag = true;
      let i = 0;
      while(flag){
        let tab = document.querySelector(`button#tab${i}`);
        let pannel = document.querySelector(`div[aria-labelledby="tab${i}"]`);
        if(tab && pannel) {
          addHiddenDiv(`ii_${tab.innerText}`, pannel.innerText);
        } else {
          flag = false;
          break;
        }
        i++
      }
    }, parentInput);
      await new Promise(resolve => setTimeout(resolve, 1000));


      return await context.extract(productDetails, { transform: transformParam });
    },
};
