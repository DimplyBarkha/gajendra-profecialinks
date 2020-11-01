module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "att",
    transform: null,
    domain: "att.com",
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    // await context.evaluate(async function () {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = 'test';
    //   newDiv.textContent = 'test';
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);

    //   const videoSelector = '//script[@type="application/ld+json"][contains(text(),"VideoObject")]';
    //   const videoApis = document.evaluate(
    //     videoSelector,
    //     document,
    //     null,
    //     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    //     null
    //   );
    //   await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    //   for (let i=0 ; i < videoApis.snapshotLength; i++ ) {
    //     let text = videoApis.snapshotItem(i).textContent;
    //     text = text.match(/[,]{1}[\s]*?\"contentUrl\"[ ]*?[:][ ]*?\".*\"[^,].*/)[0];
    //     //const videoObj = JSON.parse(text);
    //     //if (videoObj && videoObj.contentUrl) {
    //     if (text) {  
    //       // const url = videoObj.contentUrl;
    //       const arr = text.split(':');
    //       const newDiv = document.createElement('div');
    //       newDiv.id = `${i}-myvideo`;
    //       newDiv.textContent = arr[1];
    //       newDiv.style.display = 'none';
    //       document.body.appendChild(newDiv);
    //     }
    //  }
    // });
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
