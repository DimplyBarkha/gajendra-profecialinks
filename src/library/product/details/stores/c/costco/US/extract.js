const { transform } = require('./shared');
// @ts-ignore
const { implementation } = require('./extractImplementation');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform,
    domain: 'costco.com',
    zipcode: '98188',
  },
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const element = document.querySelectorAll('div.row.active div.product-info-description li');
      if (element) {
        for (let i = 1; i <= element.length; i++) {
          if (document.querySelector(`div.row.active div.product-info-description li:nth-child(${i})`) && document.querySelector(`div.row.active div.product-info-description li:nth-child(${i})`).textContent) {
            const val = document.querySelector(`div.row.active div.product-info-description li:nth-child(${i})`).textContent.replace(/(.*)/, '|| $1');
            document.querySelector(`div.row.active div.product-info-description li:nth-child(${i})`).textContent = val;
          }
        }
      }
      const elements = document.querySelectorAll('ul.pdp-features li');
      if (elements) {
        for (let i = 1; i <= element.length; i++) {
          if (document.querySelector(`ul.pdp-features li:nth-child(${i})`) && document.querySelector(`ul.pdp-features li:nth-child(${i})`).textContent) {
            const vals = document.querySelector(`ul.pdp-features li:nth-child(${i})`).textContent.replace(/(.*)/, '|| $1');
            document.querySelector(`ul.pdp-features li:nth-child(${i})`).textContent = vals;
          }
        }
      }
      const bulletsNode = document.querySelectorAll('ul.pdp-features li');
      const detailsNode = document.querySelector('div.row.active div.product-info-description');
      // const featuresNode = document.querySelectorAll('div.row.active div.product-info-description ul li');
      var descText = 'Features: ';
      // var featureText = '';
      var detailsDesc = '';
      if (bulletsNode.length) {
        bulletsNode.forEach((ele) => {
          // @ts-ignore
          if (ele.innerText.includes('||')) {
            // @ts-ignore
            descText += ' ' + ele.innerText;
          } else {
            // @ts-ignore
            descText += ' ' + '||' + ele.innerText;
          }
        });
      }
      // @ts-ignore
      if (detailsNode && detailsNode.innerText) {
        // @ts-ignore
        detailsDesc = detailsNode.innerText;
      }
      if (detailsDesc || descText) {
        addHiddenDiv('costco-product-desc', descText.concat(' ' + detailsDesc));
      };

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      const parentNode1 = document.querySelector('div.syndi_powerpage');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (parentNode1 && parentNode1.shadowRoot) {
        let manuFacturerDesc = '';
        const images = [];
        const fetchNode = parentNode1.shadowRoot.firstChild;
        // @ts-ignore
        var text = fetchNode.innerText;
        text = text.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ').trim();
        manuFacturerDesc = manuFacturerDesc + text;
        // @ts-ignore
        const manImages = fetchNode.querySelectorAll('img');
        if (manImages && manImages.length > 0) {
          for (let i = 0; i < manImages.length; i++) {
            let img = manImages[i].src;
            img = img.replace('/240.', '/480.');
            images.push(img);
          }
        }
        if (manuFacturerDesc) {
          addHiddenDiv('descriptionMenu', manuFacturerDesc);
        }
        if (images.length > 0) {
          for (let x = 0; x < images.length; x++) {
            addHiddenDiv(`manuf-images-${x}`, images[x]);
          }
        }
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });

    /* video */
    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div input[name="view-more"]');
      if (moreBtn && moreBtn.length > 0) {
        for (let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            // @ts-ignore
            moreBtn[cnt].click();
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (err) { }
        }
      }
    });
    // await context.evaluate(async () => {
    //   const parentNode1 = document.querySelector('div.syndi_powerpage');
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   if (parentNode1 && parentNode1.shadowRoot) {
    //     const fetchNode = parentNode1.shadowRoot.firstChild;
    //     // @ts-ignore
    //     const allVideos = Array.from(fetchNode.querySelectorAll('video'));
    //     for (let item = 0; item < allVideos.length; item++) {
    //       allVideos[item].click();
    //       await new Promise(resolve => setTimeout(resolve, 1000));
    //     }
    //   }
    // });
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const iframe = document.querySelector('[title="Product Videos"]');
        if (iframe) {
          // @ts-ignore
          const video = iframe.contentWindow.document.getElementsByTagName('video');
          const videoUrls = [...video].map(elm => elm.src);
          document.querySelector('head').setAttribute('video', videoUrls.join(''));
        } else {
          let id = document.querySelector('p[id="product-body-item-number"]') ? document.querySelector('p[id="product-body-item-number"]').textContent.match(/(\d+)/g) : '';
          id = id[0];
          const url = 'https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=' + id + '&format=json';
          // const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
          // const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
          const data = await fetch(url);
          if (data.status === 200) {
            const json = await data.json();
            const arr = [];
            const array = json.widgets.widget;
            array.forEach(item => {
              const val = item.asset_id;
              const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
              arr.push(url);
            });
            let count = 0;
            arr.forEach(item => {
              document.querySelector('head').setAttribute(`vid${count}`, item);
              count++;
              addHiddenDiv('videos', arr[0]);
            });
          }
        }
      } catch (err) {}
    });
    await context.evaluate(async function () {
      try {
        const vidImage = Array.from(document.querySelectorAll('img[id*="videoOverlay"]'));
        for (let item = 0; item < vidImage.length; item++) {
          // @ts-ignore
          vidImage[item].click();
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (err) {}
    });
    var videoRequest = await context.searchForRequest('https://content.syndigo.com/asset/.*ts', 'GET');
    // videoRequest = videoRequest.JSON.stringify();
    // const data = (videoRequest && videoRequest.responseBody && videoRequest.responseBody.body) ? JSON.parse(videoRequest) : null;
    if (videoRequest && videoRequest.url) {
      console.log('videos-------->', videoRequest.url);
      await context.evaluate((videoRequest) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('videos1', videoRequest.url);
      }, videoRequest);
    }

    var allVariants = await context.evaluate(async function () {
      const scriptEl = document.evaluate("//script[contains(., 'pricePerUnit')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (scriptEl) {
        const scriptText = scriptEl.innerText;
        allVariants = JSON.parse(scriptText.split('var products =')[1].split('var options = ')[0].split('\n').join('').trim().slice(0, -1));

        if (allVariants[0].length > 1) {
          for (const product of allVariants[0]) {
            const variantSku = product.partNumber;
            const variantEl = document.createElement('import-variant-sku');
            variantEl.setAttribute('data', variantSku);
            document.body.appendChild(variantEl);
          }
        }
      }
      return allVariants;
    });
    if (allVariants[0].length > 1) {
      for (const product of allVariants[0]) {
        await context.extract(productDetails, { transform });
      }
    }
    console.log('------>', allVariants);

    return await context.extract(productDetails, { transform });
  },
};
