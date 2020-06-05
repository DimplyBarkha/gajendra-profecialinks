
module.exports = {
  implements: 'product/details/extract',
  parameterValues: { 
    country: 'US',
    store: 'cvs',
    transform: null,
    domain: 'cvs.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {


    await new Promise(r => setTimeout(r, 10000));

    let linkURL = await context.evaluate(function() { 

      var element = document.querySelector("div.css-1dbjc4n.r-18u37iz.r-tzz3ar a");
      if (element) {
        return element.href
      } else {
        return null
      }
      
    })
    console.log(linkURL)
    await context.goto(linkURL)

    await new Promise(r => setTimeout(r, 8000));


    await context.evaluate(function () {
      // document.body.setAttribute("ii_url", window.location.href);



      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        // newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }

      function collectNutritionInfo () {
        let i = 1;
        const termsWithValues = {};
        while (i < 200) {
          const nutrTerm = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(1) > div.css-901oao:nth-of-type(${i})`);
          const nutrValue = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(2) > div.css-901oao:nth-of-type(${i})`);
          if (nutrTerm) {
            termsWithValues[nutrTerm.innerHTML] = nutrValue.innerHTML;
          } else {
            break;
          }
          i++;
        }

        Object.keys(termsWithValues).forEach((term) => {
          console.log(term);
          addHiddenDiv(`ii_${term}`, termsWithValues[term]);
        });
      }

      function collectBools () {

          const imageZoom = document.querySelector('div[data-class="zoom-btn"]');
          const Image360 = document.querySelector('div#wc-360-view-2e50e148');

          if (imageZoom) {
            addHiddenDiv(`ii_imageZoom`, "true");
          } 
          if (Image360) {
            addHiddenDiv(`ii_image360`, "true");
          } 
      }

      collectBools()
      collectNutritionInfo();

      addHiddenDiv('ii_url', window.location.href);
    });

    await context.extract(productDetails);
  },
};
