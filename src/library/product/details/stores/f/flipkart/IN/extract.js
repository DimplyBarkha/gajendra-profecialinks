
const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function scrollToRec (node) {
    await context.evaluate(async (node) => {
      const element = document.querySelector(node) || null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('footer');
  await scrollToRec('div._1YokD2');

  try {
    await context.waitForSelector('div.card-tile', { timeout: 45000 });
  } catch (error) {
    console.log('Not loading UPDP');
  }

  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const GetTagByIdUsingRegex = (tag, id, html) => {
      return new RegExp('<' + tag + '[^>]*id[\\s]?=[\\s]?[\'"]' + id + '[\'"][\\s\\S]*?<\/' + tag + '>').exec(html);
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';

      document.body.insertAdjacentHTML('beforeend', outerHTML);
    });

    const readMoreBtn = document.querySelector('button[class*="_2KpZ6l _1FH0tX"]');
    if (readMoreBtn) {
      // @ts-ignore
      readMoreBtn.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }

    const JSstring = document.body.querySelector('#is_script') ? document.body.querySelector('#is_script').innerHTML : '';
    const obj = JSON.parse(JSstring.split('window.__INITIAL_STATE__ = ').slice(-1)[0].trim().slice(0, -1));
    const mediaObject = obj.pageDataV4.page.data[10001]['0'].widget.data.multimediaComponents;
    if (mediaObject.hasOwnProperty(1)) {
      console.log(mediaObject.length);
      for (var i = 1; i < 3; i++) {
        console.log(i);
        if (mediaObject[i].value.contentType === 'VIDEO') {
          addElementToDocument('videoUrl', mediaObject[i].value.url);
        }
      }
    }

    const imageFromThumbnails = document.querySelectorAll('li[class*=\'_4f8Q22 2y_FdK\'] div div').length ? document.querySelectorAll('li[class*=\'_4f8Q22 2y_FdK\'] div div')[0].getAttribute('style') : '';
    if (imageFromThumbnails) {
      const imageFromThumbnailsTransformed = imageFromThumbnails.substr(21, imageFromThumbnails.length - 22).replace('/128/128/', '/416/416/'); ;
      addElementToDocument('thumbnailsMainImage', imageFromThumbnailsTransformed);
    } else {
      if (mediaObject.hasOwnProperty(0)) {
        if (mediaObject[0].value.contentType === 'IMAGE') {
          const imageUrl = mediaObject[0].value.url.replace('{@width}/{@height}', '416/416').replace('{@quality}', '70');
          addElementToDocument('imageUrl', imageUrl);
        }
      }
    }

    const jsonData = JSON.parse(document.getElementById('jsonLD').innerHTML);
    if ('brand' in jsonData[0]) {
      const brandText = jsonData[0].brand.name;
      addElementToDocument('brandText', brandText);
    }

    const manufactureBtn = document.querySelector('div._1JDTUN');
    if (manufactureBtn) {
      // @ts-ignore
      manufactureBtn.click();
      console.log('button clicked');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
  });
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
