
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
    const videoEle = await context.evaluate(async () => {
      const videoEle = document.querySelector('.demoupUI-playimage');
      if (videoEle) {
        videoEle.click();
        return videoEle;
      }
    });
    if (videoEle) {
      await context.waitForSelector('div.demoupUI-videocontainer video source');
    }
    const ImgaeEleNode = await context.evaluate(async () => {
      const ImgaeEle = document.querySelectorAll('div#inpage_container img');
      if (ImgaeEle) {
        return ImgaeEle;
      }
    });
    if (ImgaeEleNode && Object.keys(ImgaeEleNode).length) {
      await context.waitForSelector('div#inpage_container img');
    }
    await context.evaluate(async () => {
      var src = '';
      const imageEle = document.querySelectorAll('div#inpage_container img');
      const imageMan = document.querySelectorAll('div.longdesc img');
      var ele = document.querySelectorAll('source');
      if (ele && ele.length) {
        ele.forEach(e => {
          if (e.src.includes('.mp4') || e.src.includes('.webm')) {
            src = e.src;
          }
        });
      };
      if (src) {
        addHiddenDiv('video-url', src);
      }
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
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
