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
    try{
      var myFrames = document.querySelectorAll('iframe[title="Product Videos"]')
      console.log(myFrames)
      myFrames.forEach((frame, index) => {
        console.log("Inside frame loop" + frame)
        var myFrameDoc = frame.contentDocument
        console.log(myFrameDoc)
        var videos = myFrameDoc.querySelectorAll("video")
        console.log(videos)
        videos.forEach((video, index1) => {
          console.log('Found video' + `video_${index}_${index1}`+ video.src)
          addHiddenDiv(`video_${index}_${index1}`, video.src);
        });
      });
    }catch(e){
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
          if(arrDesc){
          arrDesc = arrDesc.shadowRoot.querySelectorAll('div.syndigo-featureset-feature')
          const enhancedContent = [...arrDesc].reduce((a, elm) => a + elm.innerText, '');
            manufacturerContent.innerText = manufacturerContent.innerText + enhancedContent
          }
        }
      }
    }
  });
  // await context.evaluate(() => {});
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
