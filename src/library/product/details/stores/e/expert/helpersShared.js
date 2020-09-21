
class SharedHelpers {
  constructor (context) {
    this.context = context;
  }

  async addHiddenInfo (elementID, content) {
    await this.context.evaluate(async function (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.id = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }, elementID, content);
  }

  async addHiddenArrayList (elementID, value) {
    await this.context.evaluate(async function (elementID, value) {
      const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
      const root = document.body;
      root.insertAdjacentHTML('beforeend', htmlString);
      const innerHTML = value.reduce((acc, val) => {
        return `${acc}<li>${val}</li>`;
      }, '<ul>') + '</ul>';
      document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
    }, elementID, value);
  }

  async getEleByXpath (xpath) {
    return await this.context.evaluate((xpath) => {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const text = element ? element.textContent : null;
      return text;
    }, xpath);
  }

  async goToiFrameLink (apiManufCall, link, imgSelector, getAttrImgSrc, vidSelector, getAttrVidSrc) {
    let content = null;
    let image = null;
    let video = null;
    await this.context.goto(apiManufCall, {
      timeout: 100000,
      waitUntil: 'load',
    });
    const text = await this.context.evaluate(async function () {
      return document.querySelector('body').innerText;
    });
    content = text;
    const images = await this.context.evaluate(async function (imgSelector, getAttrImgSrc) {
      const images = document.querySelectorAll(imgSelector);
      const imagesSrc = [];
      [...images].forEach((element) => {
        imagesSrc.push(element.getAttribute(getAttrImgSrc));
      });
      return imagesSrc;
    }, imgSelector, getAttrImgSrc);
    image = images;

    if (vidSelector && vidSelector.length) {
      video = await this.context.evaluate(async function (vidSelector, getAttrVidSrc) {
        const videosElements = document.querySelectorAll(vidSelector);
        const videoSrc = [];
        [...videosElements].forEach((element) => {
          if (element.getAttribute(getAttrVidSrc)) {
            videoSrc.push(element.getAttribute(getAttrVidSrc).toString());
          }
        });
        const videosArr = Array.from(new Set(videoSrc));
        return videosArr.join(' || ');
      }, vidSelector, getAttrVidSrc);
    }
    await this.context.goto(link);
    return { content: content, image: image, video: video };
  }
}
module.exports = SharedHelpers;
