
const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    domain: 'costco.com',
    zipcode: '98188',
    transform,
  },
  // @ts-ignore
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 11000));
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
      // if (featuresNode.length) {
      //   var index = -1;
      //   if (detailsDesc) {
      //     detailsDesc = detailsDesc.replace(/(\r\n|\n|\r)/gm, '');
      //     // @ts-ignore
      //     index = detailsDesc.indexOf(featuresNode[0].innerText);
      //   }
      //   featuresNode.forEach((ele) => {
      //     // @ts-ignore
      //     if (ele.innerText) {
      //       // @ts-ignore
      //       featureText += ' ' + '||' + ele.innerText;
      //       // @ts-ignore
      //       detailsDesc = detailsDesc.replace(ele.innerText, '');
      //     }
      //   });
      //   if (index !== -1) {
      //     detailsDesc = [detailsDesc.slice(0, index), featureText, detailsDesc.slice(index)].join('');
      //   }
      // }
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
    await new Promise(resolve => setTimeout(resolve, 11000));
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
    await context.evaluate(async function () {
      try {
        const iframe = document.querySelector('[title="Product Videos"]');
        if (iframe) {
          // @ts-ignore
          const video = iframe.contentWindow.document.getElementsByTagName('video');
          const videoUrls = [...video].map(elm => elm.src);
          document.querySelector('head').setAttribute('video', videoUrls.join(''));
        } else {
          const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
          const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
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
            });
          }
        }
      } catch (err) {}
    });

    return await context.extract(productDetails, { transform });
  },
};
