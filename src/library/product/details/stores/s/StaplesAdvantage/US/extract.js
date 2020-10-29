async function implementation(inputs, parameters, context, dependencies) {
  // const url = 'https://www.staplesadvantage.com/product_{id}'.replace(
  //   '{id}',
  //   encodeURIComponent(inputs.id),
  // );

  // going to iFrame url, if exists, in order to receive data from it

  const iFrameSrc = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').src;
  });

  const iFrameContent = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').style.height;
  });

  // checking if iFrame has a content

  if (iFrameContent !== '8px') {
    await context.goto(iFrameSrc);

    await context.click('div.ccs-cc-inline-embedded-video');

    // waiting video to load

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // extract data in iframe

    // const iFrame = await context.evaluate(async () => {
    //   var manufacturerImages = document.querySelectorAll('a[class="ccs-cc-thumbnail-wrapper"]>img');
    //   var videos = document.querySelectorAll('video');
    //   var videoLength = document.querySelectorAll('span[class="mejs__duration"]');
    //   return { manufacturerImages: manufacturerImages, videos: videos, videoLength: videoLength };
    // });

    // going back to default page

    // const dataRef = await context.data();

    // dataRef[0].data[0].group[0].manufacturerImage[0].text = iFrame.manufacturerImage,
    //   dataRef[0].data[0].group[0].videos[0].text = iFrame.videos,
    //   dataRef[0].data[0].group[0].videoLength[0].text = iFrame.videoLength,

    // await context.goto(url);
    await context.extract('/product/details/stores/s/StaplesAdvantage/US/extract', 'APPEND');
  };
};
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: null,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },implementation,
};
