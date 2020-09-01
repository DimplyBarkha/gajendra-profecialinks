const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'but',
    transform,
    domain: 'but.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.waitForXPath('//script[contains(.,"reviewListStatistics")]');
    } catch (error) {
      console.log("SCript not loaded");
    }
    try {
      await context.waitForXPath("//div[@class='s7staticimage img']");
    } catch (error) {
      console.log("Image not loaded");
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
       // function to get the json data from the string
    function findJsonData (scriptSelector, startString, endString) {
       
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
       let elementTxt = (element !== null) ? element.textContent : ''
        return elementTxt;
    };
    let videoContent = findJsonData ('reviewListStatistics',' var appData =','};')
    addHiddenDiv('videos', videoContent);
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      }
      let image = document.querySelector('div.s7staticimage img');
      // @ts-ignore
      image = image ? image.src : '';
      addHiddenDiv('image', image);
      // let videoList = document.querySelectorAll("#product-swiper > ul > li.swiper-slide.simpleVideo");
      // let videoArr = [];
      // for (let index = 0; index < videoList.length; index++) {
      //   // @ts-ignore
      //   videoList[index] = videoList[index] ? videoList[index].click() : '';
      //   let close = document.querySelector('button.mfp-close');
      //   let videoUrl = document.querySelector('iframe.mfp-iframe');
      //   // @ts-ignore
      //   videoUrl = videoUrl ? videoUrl.src : '';
      //   videoArr.push(videoUrl);
      //   // @ts-ignore
      //   close = close ? close.click() : '';
      // }
      // // @ts-ignore
      // videoArr = videoArr.join(' | ');
      // addHiddenDiv('videos', videoArr);

      let description = document.querySelector('div[class="product-part toscroll"]');
      let descriptionHTML = description ? description.innerHTML : '';
      descriptionHTML = descriptionHTML ? descriptionHTML.replace(/<h2(.*)h2>/gm, '').replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Les plus produit','').replace('description produit','').trim() : '';
      addHiddenDiv('descriptionHTML', descriptionHTML);
    });
    return await context.extract(productDetails, { transform });
  },
};
