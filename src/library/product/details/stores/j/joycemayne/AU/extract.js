const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  console.log(inputs.id + ' is input id');
  if (inputs.id) {
    const searchUrl = `https://www.joycemayne.com.au/catalogsearch/result/?q=${inputs.id}`;
    await context.goto(searchUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (document.querySelector('div[id="category-grid"] div:first-child a')) {
        document.querySelector('div[id="category-grid"] div:first-child a').click();
        await stall(4500);
      }
    });
    // const url = `https://grocery.walmart.com/v3/api/products/${id}?itemFields=all&storeId=5260`;
  }

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Scrolling till footer as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 5000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('footer[class="footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 400;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class="footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    await scrollToLoadAplusImages();

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[class="box-description cms"] img');
    const descriptionSelector = document.querySelector('div[class="box-description cms"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      description = description ? description.replace(/(\n\s*){1,}/g, ' || ') : '';
      description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      const descContent = document.querySelector('div[class="box-description cms"]') ? document.querySelector('div[class="box-description cms"]').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      addHiddenDiv('added-description', descContent);
    }

    let availabilityText = 'Out Of Stock';
    if (document.querySelector('div.standout-attribute span')) {
      if (document.querySelector('div.standout-attribute span').innerText.includes('Limited stock')) {
        availabilityText = 'In Stock';
      }
    }
    if (document.querySelector('button#btn-add-to-cart span')) {
      if (document.querySelector('button#btn-add-to-cart span').innerText.includes('ADD TO CART')) {
        availabilityText = 'In Stock';
      }
    }
    addHiddenDiv('availabilityText', availabilityText);
    // span[contains(text(), "Add To Cart") or contains(text(),"Limited")]
  });

  // Nar Code Start

  const link = await context.evaluate(function () {
    return window.location.href;
  });

  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('#eky-dyson-iframe');
    // const src = iframe ? (iframe.src||iframe._src) : '';
    let src = '';
    if (iframe) {
      if (iframe.hasAttribute('src')) {
        src = iframe.getAttribute('src');
      } else if (iframe.hasAttribute('_src')) {
        src = iframe.getAttribute('_src');
      } else {
        console.log('we do not have any src in iframe');
      }
    } else {
      console.log('we do not have the iframe');
      const inBoxText = [];
      const getInTheBoxTextOnly = document.querySelector('div.product-packcontents');
      const intheboxppresent = document.querySelector('div.inpage_selector_InTheBox');
      if(getInTheBoxTextOnly && !intheboxppresent){
        const getAllProductsTextOnly = document.querySelectorAll('div.product-packcontents > div.content >ul >li');
        for (let i = 0; i < getAllProductsTextOnly.length; i++) {
          inBoxText.push(getAllProductsTextOnly[i].innerText);
        }
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      for (let i = 0; i < inBoxText.length; i++) {
        if (inBoxText[i]) {
          addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
        }
      }
    }
    console.log('iframe src to go to - ' + src);

    return src;
  });
  // let content = null;
  if (src) {
    try {
      await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

      const witbData = await context.evaluate(async () => {
        const getInTheBox = document.querySelector('div.eky-accesory-container img');
        const getInTheBoxVideo = document.querySelector('div.eky-container-full');
        const inBoxUrls = [];
        const inBoxText = [];
        if(getInTheBoxVideo){
          const getAllProductsVideo = document.querySelectorAll('div.tns-inner > div.my-slider>div.eky-relative-wrapper.tns-normal');
          for (let i = 0; i < getAllProductsVideo.length; i++) {
            inBoxUrls.push(getAllProductsVideo[i].querySelector('div.eky-header-video-container>video').getAttribute('src'));
            inBoxText.push(getAllProductsVideo[i].querySelector('div.eky-overlay>div.lax>h1').innerText);
          }
        }
        if (getInTheBox) {
          const getAllProducts = document.querySelectorAll('div.eky-accesory-container > div.eky-accessory');
          for (let i = 0; i < getAllProducts.length; i++) {
            inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('src'));
            inBoxText.push(getAllProducts[i].querySelector('div').innerText);
          }
        }
        return { inBoxText, inBoxUrls };
      });

      await context.goto(link, { timeout: 5000 });
      await context.waitForSelector('#product-view-container', { timeout: 5000 });

      await context.evaluate(async (witbData) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        const { inBoxText = [], inBoxUrls = [] } = witbData;
        for (let i = 0; i < inBoxUrls.length; i++) {
          addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
          if (inBoxText[i]) {
            addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
          }
        }      
      }, witbData);
      // await context.waitForSelector('div#main-section', { timeout: 45000 });
    } catch (error) {
      try {
        await context.evaluate(async function (src) {
          window.location.assign(src);
        }, src);
        await context.waitForSelector('div.eky-container-full');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (err) {
        console.log(err);
      }
    }
    // return await context.extract(productDetails, { transform });
  } else {
    console.log('we do not have the src for iframe');
    
  }

  // Nar Code End
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    transform,
    domain: 'joycemayne.com.au',
    zipcode: '',
  },
  implementation,
};
