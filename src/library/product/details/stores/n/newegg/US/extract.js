// const { transform } = require('./shared');
const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform,
    domain: 'newegg.com',
    zipcode: '',
  },
  implementation: async (
    // @ts-ignore
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    // const { cleanUp } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 400;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          // @ts-ignore
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    // @ts-ignore
    await context.evaluate(async function (context) {
      const seeAllSelector = document.querySelector('[class="top-country-bottom"]>button');
      if (seeAllSelector) {
        // @ts-ignore
        seeAllSelector.click();
      }
    });
    // @ts-ignore
    await context.evaluate(async function (context) {
      const seeAllSelector1 = document.querySelector('[id="popup"]>a');
      if (seeAllSelector1) {
        // @ts-ignore
        seeAllSelector1.click();
      }
    });
    await applyScroll(context);
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const enhancedContent = document.querySelector('div[class*="syndi_powerpage"]');
      if (enhancedContent) {
        // @ts-ignore
        const witbData = Array.from([...enhancedContent.shadowRoot.querySelectorAll('[class="syndigo-widget-section-header"]')].find(elm => elm.innerText.match(/in the box/i)).nextElementSibling.querySelectorAll('[class="syndigo-featureset-feature"]'))
        witbData.forEach(element => {
          element.querySelector('h3') && addElementToDocument('witbText', element.querySelector('h3').innerText);
          element.querySelector('img') && addElementToDocument('witbImg', element.querySelector('img').src);
        });
      }
      const comparisonTable = document.querySelector('div[class*="syndi_powerpage"]');
      if (comparisonTable) {
        // @ts-ignore
        const witbData1 = [...comparisonTable.shadowRoot.querySelectorAll('div[class="syndi_powerpage"] div[class*="syndigo"]')]
        witbData1.forEach(element => {
          element.querySelector('h2[class="syndigo-widget-section-header"]') && addElementToDocument('witbTable', element.querySelector('h2[class="syndigo-widget-section-header"]').innerText);
        });
      }
      // const expandDataT = document.querySelector('div[id="wc-power-page"]');
      // var finalValue;
      // if (expandDataT.querySelector('h2').innerText.match(/Comparison Chart/i)) {
      //   finalValue = "Yes";
      // }
      // addElementToDocument('elementDataT', finalValue);

      function addHiddenDiv(id, content) {
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
      function extractContent(s) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      };

      function replaceLi(string, search, replace) {
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
          // @ts-ignore
          var videoLink = vLink.contentWindow.document.getElementsByTagName('video').vjs_video_1_html5_api;
          // var link = '';
          if (videoLink) {
            var link = videoLink.src;
          }
        }
      }
      let links = [];

      const videoIds = document.evaluate('//div[@class="jw-preview jw-reset"]/@style', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let index = 0; index < videoIds.snapshotLength; index++) {
        const element = videoIds.snapshotItem(index);
        let video = element && element.textContent.replace(/(.+)url\("(.+)(v2\/media)(.+)\/(.+)/g, '$2previews$4');
        links.push(video);
      }

      if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) {
        document.querySelectorAll('div.wc-reset > ul > li > div > div > img.wc-media.wc-video').forEach(e => {
          links.push(e.getAttribute('wcobj'));
        });
      }
      // if (document.querySelector('div.wc-reset > ul > li > div > div > img.wc-media.wc-video')) 
      addHiddenDiv('video', links.join(' | '));
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
    return await context.extract(productDetails, { transform });
    // await context.extract(productDetails);
  },
  // implementation,const { transform } = parameters;
  // Updated code
};
