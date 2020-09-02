
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
      }

      if (row.image && !row.image[0].text.startsWith('http')) {
        row.image[0].text = `https://www.elgiganten.se${row.image[0].text}`;
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https://www.elgiganten.se${image.text}`;
          }
        });
      }

      if (row.description) {
        let text = '';
        text = row.description[0].text.replace(/\n/g, ' ');
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(bullet => {
            text = text + ' || ' + bullet.text;
          });
        }
        if (row.description[1]) {
          for (let i = 1; i < row.description.length; i++) {
            text = text + ' | ' + row.description[i].text.replace(/\n/g, ' ');
          }
        }
        row.description = [{
          text: text,
        }];
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https://www.elgiganten.se${image.text}`;
          }
        });
      }

      if (row.videos) {
        row.videos.forEach(video => {
          if (!video.text.startsWith('http')) {
            video.text = `https://www.elgiganten.se${video.text}`;
          }
        });
      }

      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\s*\n\s\n)+/g, ': ')}`, '').slice(4),
        },
        ];
      }

      if (row.price) {
        row.price[0].text = row.price[0].text.replace(/(\s)+/g, '');
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\n*\s\n)+/g, ' ');
      }
    }

    return data;
  };
};
module.exports = { transform };
