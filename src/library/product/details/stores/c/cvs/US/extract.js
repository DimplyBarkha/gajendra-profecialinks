const { transform } = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: { 
    country: 'US',
    store: 'cvs',
    transform,
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

    // await new Promise(r => setTimeout(r, 40000));

    const sectionsDiv = 'div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs';
    await context.waitForSelector(sectionsDiv, { timeout: 90000 });

    await context.evaluate(function () {
      // document.body.setAttribute("ii_url", window.location.href);

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }

      function identifySections () {
          const sectionList = ['Warnings', 'Directions', 'Ingredients'];
          // const nodeListTitles = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs h2');
          // const nodeListText = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs div.htmlView');
          const nodeList = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs');
          let i = 0;
          
          while (i < nodeList.length && i < 10) {
          
            let section = (nodeList[i].childNodes[0].innerText).split(" ");
            let sectionLast = section.length - 1;
            if(sectionList.includes(section[sectionLast])) {
              
              console.log(section[sectionLast] + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', nodeList[i].childNodes[1].innerText)
              addHiddenDiv(`ii_${section[sectionLast]}`, `${nodeList[i].childNodes[1].innerText}`);
            } else{ 
              console.log('Did Not Wrok')
              // addHiddenDiv(`ii_Warnings`, `DID NOT WORK`);
            }
            i++;
          }
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
          } else {
            addHiddenDiv(`ii_imageZoom`, "false");
          }
          if (Image360) {
            addHiddenDiv(`ii_image360`, "true");
          } else {
            addHiddenDiv(`ii_image360`, "false");
          }
      }

      function collectManufImages () {

        const manufImages = document.querySelectorAll('div.wc-aplus-body div.wc-reset img[src]')
        const imageSrcArray = []

        if (manufImages) {
          manufImages.forEach(img => {
            addHiddenDiv(`ii_manufImages`, `${img.src}`);
          })
        }
    }

    function collectVariantInfo () {

      const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao')
      const variantArray = []

      if (variantInfo[1]) {
          variantArray.push(variantInfo[1].innerText);
      }

      if (variantInfo[3]) {
        variantArray.push(variantInfo[3].innerText);
    }

      let variantString = variantArray.join(" ");
      addHiddenDiv(`ii_variantInfo`, `${variantString}`);
  }

  function collectBrand () {

    const brandBlock = document.querySelector('script#schema-json-ld')
    const brandObject = JSON.parse(brandBlock.innerText)

    if (brandObject[0].brand) {
      addHiddenDiv(`ii_Brand`, `${brandObject[0].brand}`);

    }
}

      identifySections()
      collectNutritionInfo();
      collectBools()
      collectManufImages()
      collectVariantInfo()
      collectBrand()

      addHiddenDiv('ii_url', window.location.href);
    });

    return await context.extract(productDetails, { transform });
    // await context.extract(productDetails);
  },
};
