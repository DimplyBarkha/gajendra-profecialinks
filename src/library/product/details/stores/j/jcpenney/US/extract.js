const { transform } = require('./shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function appendImages(selector, images) {
      [...document.querySelectorAll(selector)].map((e, index) => { e.setAttribute("mainImage", `${images[index][0]}`)});
    }
    // function secondaryImages(selector, images) {
    //   [...document.querySelectorAll(selector)].map((e, index) => { e.setAttribute("secondaryImages", `${alternateImages}`)});
    // }

    // function addHiddenDiv (id, content) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);
    // }

    // const optionalWait = async (sel) => {
    //   try {
    //     await context.waitForSelector(sel, { timeout: 60000 });
    //   } catch (err) {
    //     console.log(`Couldn't load selector => ${sel}`);
    //   }
    // };
    const finalImages = [];
    const isVariants = document.querySelector('ul[data-automation-id="product-dimensions-color"]');
    const variants = "#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li"


    if (isVariants) {
      document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li button').forEach(ele => {
        ele.click();
        console.log('Clicked');
        var jsonString = document.querySelector("script[type='application/ld+json']").innerText;
        let jsonParsed = {};
        jsonParsed = JSON.parse(jsonString);

        [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
          e.setAttribute("sku", jsonParsed.offers.map(( ele )=>{ return ele.sku }))});

        [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
          e.setAttribute("nameExtended",`${document.querySelector('h1[data-automation-id="product-title"]').textContent} ` + `- ${e.textContent}`)});

        [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
          e.setAttribute("secondaryImages", [...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return `https:${e.querySelector('img').getAttribute('src')}`}))});

        finalImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return e.querySelector('img').getAttribute('src')}));
        // optionalWait('h1[data-automation-id="product-title"]');
        // const mainImage = document.querySelector('div._3IMdO div.image-desktop img').getAttribute('src');
        // const newDiv = document.createElement('div');
        // newDiv.id = 'mainImage';
        // newDiv.textContent = mainImage;
        // // newDiv.style.display = 'none';
        // document.querySelector('main#mainContainerBlock').appendChild(newDiv);
        // alternateImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return e.querySelector('img').getAttribute('src')}));
        // secondaryImages(variants, alternateImages);
      });
    }
    appendImages(variants, finalImages);
    // let images = '';
    // Array.from(alternateImages).forEach(el => {
    //   images += `https:${el}` ? `| https:${el}` : `https:${el}`;
    // });

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    transform,
    domain: 'jcpenney.com',
    zipcode: '',
  },
  implementation,
};
