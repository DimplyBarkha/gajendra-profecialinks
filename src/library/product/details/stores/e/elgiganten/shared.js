/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        let text = "";
        row.image.forEach((item, index) => {
          text = item.text.replace("?$prod_all4one$", "");
          row.image[index].text = text;
        });
      }
      if (row.alternateImages) {
        let text = "";
        row.alternateImages.forEach((item, index) => {
          text = item.text.replace("?$prod_all4one$", "");
          row.alternateImages[index].text = text;
        });
      }
      if (row.price) {
        let text = "";
        row.price.forEach(item => {
          text = item.text.split(":");
        });
        row.price = [{ text: text[0] }, { text: text[1] }];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.productOtherInformation = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.videos) {
        let video = {};
        row.videos.forEach(item => {
          video = {
            text: 'https://www.elgiganten.dk' + item.text,
            xpath: item.xpath
          }
        });
        row.videos = [video];
      }
      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.manufacturerImages = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
