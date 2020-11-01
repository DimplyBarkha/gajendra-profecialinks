module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "att",
    transform: null,
    domain: "att.com",
    zipcode: "''",
  },
  // @ts-ignore
  implementation: async (inputs, parameters, context, dependencies) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      // function addHiddenDiv (id, content) {
      //   const newDiv = document.createElement('div');
      //   newDiv.id = id;
      //   newDiv.textContent = content;
      //   newDiv.style.display = 'none';
      //   document.body.appendChild(newDiv);
      // }

      const scriptSelector = '//script[@type="application/ld+json"][contains(text(),"contentUrl")]';
      console.log("############## scriptSelector ::::", scriptSelector);
      const videoApi = document.evaluate(
        scriptSelector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let videoElem = videoApi.iterateNext();
      const videos = [];
      let idx = 0;
      while (videoElem) {
        let text = videoElem.textContent; //.match(/contentUrl":"([^"]+)/);
        console.log("############## text ::::", text);
        videos.push(text);
        videoElem = videoApi.iterateNext();
        //addHiddenDiv(`my-video-${idx}`, text);
      }
      //return videos;
    });
    // console.log('############## videos ::::', videos);
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
