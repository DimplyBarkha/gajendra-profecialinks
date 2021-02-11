const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
  },
  implementation
  // implementation: async ({ url }, { country, domain }, context, dependencies) => {
  //   await context.evaluate(() => {
  //     const imgAlt = document.querySelector('button[class="sc-image-viewer-img-button"] img') ? document.querySelector('button[class="sc-image-viewer-img-button"] img').alt : null;
  //     document.body.setAttribute('imagealt', imgAlt);
  //   });
  //   await context.extract(dependencies.productDetails);
  // },
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const popUps = document.querySelector('div.sc-modal-content button.sc-modal-close-button')
    if (popUps) {
      popUps.click();
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 30000));
  });
  await context.evaluate(async function () {
    await new Promise((resolve, reject) => setTimeout(resolve, 30000));
    let getManufatureImageArray = [];
    let getContent = document.querySelector('iframe#wcframable1-1');
    const getManufatureImage = getContent.contentDocument.querySelectorAll('div.wc-media-available img');
    if(getManufatureImage){
      for (let i = 0; i < getManufatureImage.length; i++) {
        let urls = getManufatureImage[i].src;
        getManufatureImageArray.push(urls);
        // getManufatureImageArray.join("|");

      }
    console.log("inBoxArray >>>>>>>>>>>>>>>>", getManufatureImageArray);
    }


    function addHiddenDiv (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.id = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('getManufatureImageArray1',getManufatureImageArray);

  });
  return await context.extract(productDetails, { transform });
}