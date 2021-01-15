// const { transform } = require('./shared');
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform: cleanUp,
    domain: 'newegg.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    // const { transform } = parameters;
    const { cleanUp } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // const links = [];
      // if(document.querySelector('#product-description > div > ul > li')){
      // document.querySelectorAll('#product-description > div > ul > li').forEach(e =>{
      // links.push(e.textContent);
      // });
      // }
      // addHiddenDiv('bullets',links.join(' || '));

      // const specification = [];
      // const headingTxt = [];
      // var heads;
      // if(document.querySelector('table.table-horizontal')){
      //   // console.log(document.querySelector('table.table-horizontal').innerText,"*******************");
      //   // var heading = document.querySelectorAll('table.table-horizontal > caption').forEach(ele =>{
      //     // headingTxt.push(ele.innerHTML);

      //   document.querySelectorAll('table.table-horizontal > tbody > tr').forEach(e =>{
      //     console.log(document.querySelector('table.table-horizontal > caption').innerText);
      //   specification.push(e.textContent);
      //     // var sepcTXT= specification.join(' || ')
      //     // var spec = headingTxt.concat(sepcTXT);
      //     // console.log(spec,"&&&&&&&&&&&&&&&&&&");
      //   });
      // //  heads= ele.innerHTML + specification.join(' || ');
      // // });
      // }
      function extractContent (s) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      };

      function replaceLi (string, search, replace) {
        return string.split(search).join(replace);
      }

      var specDetails = '';
      document.querySelectorAll('table.table-horizontal').forEach(e => {
        specDetails += e.innerHTML;
      });
      console.log(specDetails, ')))))))');
      var specificationDetail = replaceLi(specDetails, '<tr>', ' | ');
      var spec = replaceLi(specificationDetail, '<caption>', ' ');
      var specification = extractContent(spec);
      console.log(specification, '******');

      addHiddenDiv('specification', specification);
      const cueenrtUrl = window.location.href;
      console.log(cueenrtUrl);
      // var skuMatch = cueenrtUrl.match(/(Tpk=)([\w.]+)/);
      var skuMatch = cueenrtUrl.match(/(\/p\/)(\w.+)(\?)/);
      if (skuMatch) {
        var sku = skuMatch[2];
      }
      addHiddenDiv('sku', sku);

      if (document.getElementsByTagName('video')) {
        const vLink = parent.document.getElementById('wcframable1-0');
        if (vLink) {
          var videoLink = vLink.contentWindow.document.getElementsByTagName('video').vjs_video_1_html5_api;
          // var link = '';
          if (videoLink) {
            var link = videoLink.src;
          }
        }
      }
      const links = [];
      if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) {
        document.querySelectorAll('div.wc-reset > ul > li > div > div > img.wc-media.wc-video').forEach(e => {
          links.push(e.getAttribute('wcobj'));
        });
      }
      if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) addHiddenDiv('video', links.join(' | '));
      addHiddenDiv('video', link);
      // (\/p\/)(\w.+)(\?)

      // const bulletInfo =
      // (document.querySelector('div.product-bullets > ul') &&
      // document.querySelector('div.product-bullets > ul').textContent
      // .split(/[\n•]/)
      // .join('||'));
      // addHiddenDiv('bulletInfo', bulletInfo);
    });
    // return await context.extract(productDetails);
    return await context.extract(productDetails, { cleanUp });
    // await context.extract(productDetails);
  },
  // implementation,
  // Updated code
};
