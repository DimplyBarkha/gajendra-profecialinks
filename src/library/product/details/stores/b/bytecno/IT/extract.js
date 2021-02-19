
const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'bytecno',
    transform: transform,
    domain: 'bytecno.it',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

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
          const getAccessories = document.querySelector('div.my-slider');
          const inBoxUrls = [];
          const inBoxText = [];
          if (getAccessories) {
            const getAllAccessories = document.querySelectorAll('div.my-slider>div.eky-relative-wrapper.tns-normal>div.eky-overlay>div.lax');
            for (let i = 0; i < getAllAccessories.length; i++) {
              inBoxText.push(getAllAccessories[i].querySelector('h1').innerText);
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

        await context.goto(link, { timeout: 15000 });
        await context.waitForSelector('#inpage_container', { timeout: 10000 });

        await context.evaluate(async (witbData) => {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }

          const { inBoxText = [], inBoxUrls = [] } = witbData;

          for (let i = 0; i < inBoxText.length; i++) {
            addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
            if (inBoxUrls[i]) {
              addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
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

    const ImgaeEleNode = await context.evaluate(async () => {
      const ImgaeEle = document.querySelectorAll('div#inpage_container');
      if (ImgaeEle) {
        return ImgaeEle;
      }
    });
    if (ImgaeEleNode && Object.keys(ImgaeEleNode).length) {
      await context.waitForSelector('div#inpage_container img');
    }

    const videos = async () => {
      const cssVideos1 = 'source';
      const cssVideos2 = 'input.flix-jw';
      const cssVideosBtn = '.demoupUI-playimage';
      try {
        await context.waitForSelector(cssVideos1, { timeout: 10000 });
      } catch (error) {
        console.log(`cssVideos1: ${cssVideos1} not loaded`);
      }

      try {
        await context.waitForSelector(cssVideos2, { timeout: 10000 });
      } catch (error) {
        console.log(`cssVideos2: ${cssVideos2} not loaded`);
      }

      try {
        await context.waitForSelector(cssVideosBtn, { timeout: 10000 });
        await context.click(cssVideosBtn);
      } catch (error) {
        console.log(`cssVideosBtn: ${cssVideosBtn}`);
        console.log('cssVideosBtn');
      }

      await context.evaluate(async ({ cssVideos1, cssVideos2 }) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        // sample url: https://www.bytecno.it/purificatore-ventilatore-dyson-pure-cool-bianco.html
        // @ts-ignore
        let allVideos = [...document.querySelectorAll(cssVideos2)].map(e => {
          const rawData = e.value;
          const jsonData = JSON.parse(rawData);
          const videos = jsonData.playlist && jsonData.playlist.map(video => {
            const v = video.file;
            return v.includes('http') ? v : `https:${v}`;
          });
          return videos;
        }).flat();

        const videoUrlNodes = document.querySelectorAll(cssVideos1);
        // @ts-ignore
        const videos = [...videoUrlNodes].map(e => e.src);
        allVideos = [...allVideos, ...videos];
        allVideos.forEach(video => addHiddenDiv('video-url', video));
      }, { cssVideos1, cssVideos2 });
    };
    await videos();

    await context.evaluate(async (context) => {
      // var src = '';
      const imageEle = document.querySelectorAll('div#inpage_container img');
      const imageMan = document.querySelectorAll('div.longdesc img');
      var urls = [];
      if (imageEle) {
        imageEle.forEach((ele) => {
          var imageUrls = ele.getAttribute('data-flixsrcset');
          if (imageUrls && imageUrls.length > 0) {
            var str = imageUrls.split(',')[0].split(' ')[0];
            urls.push('https:' + str);
          };
        });
        if (imageMan && imageMan.length) {
          imageMan.forEach((ele) => {
            var ImageSrc = ele.getAttribute('src');
            if (ImageSrc && !ImageSrc.includes('loading')) {
              ImageSrc = ImageSrc.includes('https') ? ImageSrc : 'https:' + ImageSrc;
              urls.push(ImageSrc);
            }
          });
        }
        if (urls.length > 0) {
          addHiddenDiv('manufacture-images', urls.join(','));
        }
      }
      const speNode = document.querySelectorAll('div.inpage_selector_specification td');
      var specificationValues = {};
      var spec = '';
      if (speNode && speNode.length) {
        speNode.forEach((ele) => {
          var data = ele.innerText.split('\n');
          if (data[0] && data[1]) {
            specificationValues[data[0].trim()] = data[1].trim();
            spec += ' || ' + data[0].trim() + ': ' + data[1].trim();
          }
        });
      }
      const desSpecNodeTh = document.querySelectorAll('#product-attribute-specs-table1 th');
      const desSpecNodeTd = document.querySelectorAll('#product-attribute-specs-table1 td');
      if (desSpecNodeTh.length && desSpecNodeTd.length) {
        for (var l = 0; l < desSpecNodeTh.length; l++) {
          var spekey = (desSpecNodeTh[l].innerText).trim();
          if (!specificationValues.spekey) {
            spec += ' || ' + spekey + ': ' + desSpecNodeTd[l].innerText;
          }
        }
      }
      if (specificationValues && specificationValues.Peso) {
        addHiddenDiv('product-weight', specificationValues.Peso);
      }
      if (spec) {
        addHiddenDiv('product-spec', (spec.slice(3)).trim());
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try{
        document.querySelectorAll(".product-box-customs img")[1].click();
      }catch(error){
        console.log('Image not clicked')
      }
    });
    context.click('body');
    return await context.extract(productDetails, { transform });
  },
};
