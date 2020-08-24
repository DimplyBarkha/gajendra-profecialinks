const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform,
    domain: 'flaconi.de',
  },
  implementation,
  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     function addElementToDocument (key, value) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }
  //     function addVideoElementToDocument (key, arr) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       for (let i = 0; i < arr.length; i++) {
  //         const videoElement = document.createElement('a');
  //         videoElement.href = arr[i].href;
  //         catElement.appendChild(videoElement);
  //       }
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }

  //     const directionelement1 = document.evaluate("//div[contains(@class, 'instruction-content')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //     const directionelement2 = document.evaluate("//div[contains(@class, 'instruction')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //     if (directionelement1) {
  //       addElementToDocument('fl_directioninfo', directionelement1.innerText);
  //     } else if (directionelement2) {
  //       addElementToDocument('fl_directioninfo', directionelement2.innerText);
  //     }

  //     const colorlement = document.evaluate("//ul[@id='makeup-color-list']/li[1]//span/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //     if (colorlement && colorlement.value.indexOf('background-color') > -1) {
  //       const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
  //       addElementToDocument('fl_colorcode', colorCode);
  //     }
  //     const videoarr = document.querySelectorAll('div.lazyYoutube > a[title=""]');
  //     if (videoarr && videoarr.length) {
  //       addVideoElementToDocument('pd_video', videoarr);
  //     }
  //   });
  //   await context.extract(productDetails);
  // },
};
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  await context.evaluate(async (parentInput) => {

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
   let description = document.querySelector("div[class='description-content']");
    // @ts-ignore
    description = description ? description.innerText : '';
    let descArr = [];
    // @ts-ignore
    if(description !== ''){
      descArr.push(description);
    }
    let bulletsDescription = document.querySelectorAll("div.product-description ul li");
    console.log('bulletsDescription: ', bulletsDescription);
    let bulletCount = bulletsDescription.length;
    addElementToDocument('bb_descriptionBulletsCount', bulletCount);
    for (let index = 0; index < bulletsDescription.length; index++) {
      let element = bulletsDescription[index];
      // @ts-ignore
      element = element ? element.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ') : '';
      descArr.push(element);
    }
    // @ts-ignore
    descArr = descArr.join(' || ');
    addElementToDocument('bb_descriptionBullets', descArr);
    let variantAmount = document.querySelector('ul.product-list.multiple-variants li.product-container.variant span.amount');
    // @ts-ignore
    variantAmount = variantAmount ? variantAmount.innerText : '';
    let variantUnit = document.querySelector('ul.product-list.multiple-variants li.product-container.variant span.unit');
    // @ts-ignore
    variantUnit = variantUnit ? variantUnit.innerText : '';
    addElementToDocument('ii_variantInfo', variantAmount+' '+variantUnit);
    });
    return await context.extract(productDetails, { transform });
    }
