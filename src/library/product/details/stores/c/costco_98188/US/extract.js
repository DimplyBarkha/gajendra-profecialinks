const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    domain: 'costco.com',
    transform,
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const descNode = document.querySelector('div.product-info-description');
      try {
        var parentNode = document.getElementsByClassName('syndi_powerpage');
        if (parentNode && parentNode.length && parentNode[0].shadowRoot) {
          var shadowRoot = parentNode[0].shadowRoot;
          // if (shadowRoot && shadowRoot.querySelector('video')) {
          //   var videoEle = shadowRoot.querySelector('video');
          //   videoEle.click();
          //   if (videoEle && videoEle.getAttribute('src')) {
          //     addHiddenDiv('product-video', videoEle.getAttribute('src'));
          //   }
          // }
        }
      } catch (e) {
      }
      if (descNode && descNode.innerText) {
        addHiddenDiv('product-desc', descNode.innerText);
      }
      const bulletsNode = document.querySelectorAll('ul.pdp-features li');
      const detailsNode = document.querySelector('div.row.active div.product-info-description');
      const featuresNode = document.querySelectorAll('div.row.active div.product-info-description ul li');
      var descText = '';
      var featureText = '';
      var detailsDesc = '';
      if (bulletsNode.length) {
        bulletsNode.forEach((ele) => {
          if (ele.innerText) {
            descText += '||' + ele.innerText;
          }
        });
      }
      if (detailsNode && detailsNode.innerText) {
        detailsDesc = detailsNode.innerText
      }
      if (featuresNode.length) {
        var index = -1;
        if (detailsDesc) {
          detailsDesc = detailsDesc.replace(/(\r\n|\n|\r)/gm, '');
          index = detailsDesc.indexOf(featuresNode[0].innerText);
        }
        featuresNode.forEach((ele) => {
          if (ele.innerText) {
            featureText += '||' + ele.innerText;
            detailsDesc = detailsDesc.replace(ele.innerText, '');
          }
        });
        if (index !== -1) {
          detailsDesc = [detailsDesc.slice(0, index), featureText, detailsDesc.slice(index)].join('');
        }
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

    await new Promise(resolve => setTimeout(resolve, 11000));
    await context.evaluate(async () => {
      const parentNode1 = document.querySelector('div.syndi_powerpage');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (parentNode1 && parentNode1.shadowRoot) {
        let manuFacturerDesc = '';
        const fetchNode = parentNode1.shadowRoot.firstChild;
        var text = fetchNode.innerText;
        text = text.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ').trim();
        manuFacturerDesc = manuFacturerDesc + text;
        if (manuFacturerDesc) {
          addHiddenDiv('descriptionMenu', manuFacturerDesc);
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const descNodee = document.querySelector('div.product-info-description');
      let manuFacturerDescr = '';
      if (descNodee) {
        manuFacturerDescr = descNodee.outerText;
        console.log('manuFacturerDesc ==', manuFacturerDescr);
        manuFacturerDescr = manuFacturerDescr.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      }
      try {
        const descNode2 = document.querySelector('div.syndi_powerpage');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (descNode2 && descNode2.shadowRoot) {
          const fetchNode = descNode2.shadowRoot.firstChild;
          let text = fetchNode.innerText;
          text = text.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
          manuFacturerDescr = manuFacturerDescr + text;
        }
      } catch (err) { }
      if (manuFacturerDescr.length > 0) {
        addHiddenDiv('manufacturer-descr', manuFacturerDescr);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      return [`desc.length = ${manuFacturerDescr.length}`];
    });

    await new Promise(resolve => setTimeout(resolve, 6000));

    await context.evaluate(async function () {
      try {
        const iframe = document.querySelector('[title="Product Videos"]');
        if (iframe) {
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
      } catch (err) { }
    });
    return await context.extract(productDetails, { transform });
  },
};
