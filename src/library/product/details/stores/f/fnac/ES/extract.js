const {transform} = require ('../format');

async function implementation (inputs, parameters, context, dependencies) {
  const {transform} = parameters;
  const {productDetails} = dependencies;

  // If popup comes, click it to close
  const closePopUpIfRequired = async cssBtn => {
    const isPopUpAvailable = await context.evaluate (async cssBtn => {
      return document.querySelector (cssBtn);
    }, cssBtn);

    if (isPopUpAvailable) await context.click (cssBtn);
  };

  // If cookie pop up appears then clicking on accept button
  await context.evaluate (async function () {
    const moreSelect = document.querySelector ('button.productStrate__seeMore');
    if (moreSelect) moreSelect.click ();
  });
  await context.evaluate (async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement ('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild (newDiv);
    }

    if (document.querySelector ('div.productStrate__raw')) {
      let desc = document.querySelector ('div.productStrate__raw').innerHTML;
      desc = desc
        .replace (/<li>/gm, ' || ')
        .replace (
          /<(style|script|noscript)\b[^<]*(?:(?!<\/(style|script|noscript)>)<[^<]*)*<\/(style|script|noscript)>/g,
          ''
        )
        .replace (/(<([^>]+)>)/gi, '')
        .replace (/&nbsp;/g, '')
        .trim ();
      const descriptions = desc.split (/([|]{2,}|Especificaciones)/);
      addHiddenDiv ('desc', descriptions[0]);
    }

    const text = document.querySelector ('script[type="application/ld+json"]')
      .innerText;
    const json = JSON.parse (text);
    if (json.brand) {
      addHiddenDiv ('brandText', json.brand.name);
    }
  });

  const setValueInDivToDOM = async (id, content) => {
    console.log (`Adding id: ${id} and content of ${id} to DOM`);
    console.log ('content => ', content);

    await context.evaluate (
      async (id, content) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement ('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild (newDiv);
        }
        addHiddenDiv (id, content);
      },
      id,
      content
    );
  };

  const getManufacturerDescription = async css => {
    // manufacturerDescription and manufacturerImages
    return await context.evaluate (async css => {
      const manufacturerDescriptionNode = document.querySelector (css);
      return manufacturerDescriptionNode
        ? manufacturerDescriptionNode.innerText
        : '';
    }, css);
  };

  // css selectors
  const cssManufacturerDescription = 'div.da-premium-main';
  const cssPopUp = 'a.KameleoonScenarioLayerClose';

  await closePopUpIfRequired (cssPopUp);

  const manufacturerDescription = await getManufacturerDescription (
    cssManufacturerDescription
  );
  await setValueInDivToDOM ('manufacturerDescription', manufacturerDescription);

  try {
    await context.evaluate (async () => {
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy (0, document.documentElement.clientHeight);
          await new Promise (resolve => setTimeout (resolve, 20000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll ();
      console.log ('done scrolling');
    });
  } catch (err) {
    console.log ('got some error while scrolling -', err.message);
  }

  let videoDivInfoElmXpath =
    '//div[contains(@class,"VideoPlayerPlaylist-list")]//div[@data-video-count > 0]';
  try {
    context.waitForXPath (videoDivInfoElmXpath);
    console.log ('video input elm loaded');
  } catch (err) {
    console.log ('error while waiting for video input elm', err.message);
    console.log ('waiting again');
    try {
      context.waitForXPath (videoDivInfoElmXpath);
      console.log ('video input elm loaded');
    } catch (error) {
      console.log (
        'error while waiting for video input elm -- again',
        error.message
      );
    }
  }

  let allVideos = [];
  try {
    allVideos = await context.evaluate (async videoDivInfoElmXpath => {
      let videoInfoElm = document.evaluate (
        videoDivInfoElmXpath,
        document,
        null,
        7,
        null
      );
      let allVidArr = [];
      if (videoInfoElm && videoInfoElm.snapshotLength > 0) {
        let thisVideoInfoElement = videoInfoElm.snapshotItem (0);
        let totalVideoCount = thisVideoInfoElement.hasAttribute (
          'data-video-count'
        )
          ? thisVideoInfoElement.getAttribute ('data-video-count')
          : '';
        totalVideoCount = parseInt (totalVideoCount);
        for (let i = 0; i < totalVideoCount; i++) {
          let thisUrl = thisVideoInfoElement.hasAttribute (
            `data-video-${i}-url`
          )
            ? thisVideoInfoElement.getAttribute (`data-video-${i}-url`)
            : '';
          console.log (thisUrl);
          allVidArr.push (thisUrl);
        }
      } else {
        console.log (
          'we do not have the video info element',
          videoDivInfoElmXpath
        );
      }
      return allVidArr;
    }, videoDivInfoElmXpath);
  } catch (err) {
    console.log ('issue while getting videos', err.message);
  }

  if (allVideos.length > 0) {
    await context.evaluate (async allVideos => {
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement ('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild (catElement);
      }

      console.log (allVideos.join (' || '));
      // await addElementToDocumentAsync('galleryvideos', allVideos.join(' | '));
      // 18723 - client says they want only one video -
      // for one url - we have multiple distinct video urls - which are redirecting going to the same video
      // not sure which one to discard - so getting the first one only
      await addElementToDocumentAsync ('galleryvideos', allVideos[0]);
    }, allVideos);
  } else {
    console.log ('no videos -- found');
  }

  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract (productDetails, {transform});
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
  implementation,
};
