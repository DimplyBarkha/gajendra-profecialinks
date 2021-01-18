const { transform } = require("../format");
async function implementation(inputs, parameters, context, dependencies) {
  // await new Promise((resolve) => setTimeout(resolve, 20000));
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector("div#wc-power-page");
  } catch (error) {
    console.log("Manufacturer contents are not loaded");
  }
  await context.evaluate(async () => {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      document.body.appendChild(newDiv);
    }
    const descContent = document.querySelector(
      "div.ProductDetail__productContent"
    )
      ? document
        .querySelector("div.ProductDetail__productContent")
        .innerHTML.replace(/<li>/gm, " || ")
        .replace(/<.*?>/gm, "")
        .replace(/\n/gm, " ")
        .replace(/•/gm, " ||")
        .replace(/\s{2,}/, " ")
        .trim()
      : "";
    descContent && addHiddenDiv("ii_description", descContent);
    await new Promise((resolve) => setTimeout(resolve, 15000));
    try {
      var myFrames = document.querySelectorAll('iframe[title="Product Videos"]')
      console.log(myFrames)
      myFrames.forEach((frame, index) => {
        console.log("Inside frame loop" + frame)
        var myFrameDoc = frame.contentDocument
        console.log(myFrameDoc)
        var videos = myFrameDoc.querySelectorAll("video")
        console.log(videos)
        videos.forEach((video, index1) => {
          console.log('Found video' + `video_${index}_${index1}` + video.src)
          addHiddenDiv(`video_${index}_${index1}`, video.src);
        });
      });
    } catch (e) {
      console.log("Video error" + e)
    }
    const manufacturerContent = document.querySelector("div#wc-power-page");
    if (manufacturerContent) {
      manufacturerContent.scrollIntoView({ behavior: "smooth" });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      manufacturerContent.innerHTML = manufacturerContent.innerHTML.replace(
        /<div\s*class="wc-json-data".*?<\/div>/g,
        " "
      );

      if (!manufacturerContent.innerText) {

        await new Promise((resolve) => setTimeout(resolve, 5000));
        let arrDesc = document.querySelector("div#wc-power-page div.syndi_powerpage")
        if (arrDesc) {
          arrDesc = arrDesc.shadowRoot
          if (arrDesc) {
            arrDesc = arrDesc.shadowRoot.querySelectorAll('div.syndigo-featureset-feature')
            const enhancedContent = [...arrDesc].reduce((a, elm) => a + elm.innerText, '');
            manufacturerContent.innerText = manufacturerContent.innerText + enhancedContent
          }
        }
      }
    }
  });
  // await context.evaluate(() => {
  //   const syndiPowerpage = document.querySelector('.syndigo-shadowed-powerpage');
  //           let inTheBoxText = '';
  //         let inTheBoxUrl = '';
  //           let hasComparisonTable = 'No';
  //           if (syndiPowerpage) {
  //            console.log('Shadow root!');
  //             const headings = Array.from(syndiPowerpage.shadowRoot.querySelectorAll('h2'));
  //             headings.forEach(h2 => {
  //               if (h2.innerText.includes('In the box') || h2.innerText.includes('In The Box') || h2.innerText.includes('in the box') || h2.innerText.includes('In the Box') || h2.innerText.includes("What's Included")) {
  //                 const parent = h2.parentElement;
  //            const inTheBoxEls = parent.querySelectorAll('.syndigo-featureset-feature');
  //               inTheBoxEls.forEach(el => {
  //                 const imgs = el.querySelector('img').getAttribute('src').split(',');
  //                  let images = '';
  //                  if (imgs.length === 1) {
  //                     images = imgs[0];
  //                  } else {
  //                     images = imgs[imgs.length - 1];
  //                }
  //                images = images.replace(/(.+)(\s.+)/, '$1');
  //               inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + images;
  //   // @ts-ignore
  //                  inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + el.innerText;
  //               });
  //              }
  //             });
  //          const table = syndiPowerpage.shadowRoot.querySelector('div[class*="comparison-table"] table');
  //            if (table) {
  //            hasComparisonTable = 'Yes';
  //   } else {
  //            console.log('No Shadow root!');
  //             const inTheBoxEls = Array.from(document.querySelectorAll('div[data-section-caption="In The Box"] ul>li, div[data-section-tag="in-the-box"] ul>li'));
  //          inTheBoxEls.forEach(el => {
  //              const image = el.querySelector('img').getAttribute('src');
  //             // @ts-ignore
  //             const text = el.innerText;
  //               inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + image;
  //               inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + text;
  //   });
  //             const table = document.querySelector('div[data-section-template-code*="comparison-table"] table');
  //             if (table) {
  //               hasComparisonTable = 'Yes';
  //             }
  //           }
  //           document.body.setAttribute('has-comparison-tablec', hasComparisonTable);   
  //           document.body.setAttribute('in-the-box-text', inTheBoxText);
  //           document.body.setAttribute('in-the-box-url', inTheBoxUrl);
  //         }
  //         });

  // await context.evaluate(() => {});
  await context.evaluate(async () => {
    async function getInTheBoxData() {

      try {
        var customFieldArray = [];
        const sku = document.evaluate('//link[@rel="canonical"]/@href', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.replace(/(.*?)productId=(.+)/g, '$2');
        const jsApi = `https://content.syndigo.com/page/e9a0918c-a070-421c-87b1-f5141ac38440/${sku}.json`;
        const response = await fetch(jsApi);
        const jsonData = await response.json();
        const data = jsonData.experiences[Object.keys(jsonData.experiences)].experiences['power-page'].widgets;
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (data[key].headerText.includes('the Box') || data[key].headerText.includes("What's Included")) {
              data[key].items[0].features.forEach(element => {
                var availableWidth = element.asset.availableWidths[0];
                var inTheBoxUrl = element.asset.url.replace(/(.+)\/(.+).jpeg|png/g, `$1/${availableWidth ? availableWidth : '960'}.jpeg`);
                var inTheBoxText = element.caption;
                customFieldArray.push({ imageUrl: inTheBoxUrl, boxText: inTheBoxText });
              });
            }

          }
        }
        return customFieldArray;
      } catch (error) {
        console.log('Error while', error)
      }

    }
    var inTheBoxArray = await getInTheBoxData();
    if (inTheBoxArray && inTheBoxArray.length) {
      inTheBoxArray.forEach(e => {
        var newElement = document.createElement('a');
        newElement.className = 'in-the-box'
        newElement.href = e.imageUrl;
        newElement.textContent = e.boxText;
        document.body.append(newElement);
      });
    }

    var Updp = [];
    var rows = [...document.querySelectorAll('div.Product__details')];
    if (rows && rows.length) {
      rows.map(e => {
        var brand = e && e.querySelector('div.Product__brandName p') && e.querySelector('div.Product__brandName p').textContent;
        var productName = e && e.querySelector('div.Product__productName p') && e.querySelector('div.Product__productName p').textContent;
        if (brand && productName) {
          var pName = brand + ' ' + productName;
          Updp.push(pName);
        }
      });
    }
    if (Updp && Updp.length) {
      console.log('pdp',Updp.length);
      var Fupdp = Updp.join(' || ');
      var productName = document.querySelector('h1');
      productName.setAttribute('pdp', Fupdp);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "ulta",
    transform: transform,
    domain: "ulta.us",
    zipcode: "",
  },
  implementation,
};
