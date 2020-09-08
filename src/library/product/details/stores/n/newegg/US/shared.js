
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
      }
      if (row.additionalDescBulletInfo) {
        let info = row.additionalDescBulletInfo[0].text;
        info = (info.replace(/\n \n/g, ' || ')).trim();
        row.additionalDescBulletInfo[0].text = info;
      }
      if (row.descriptionBullets) {
        const info = row.descriptionBullets[0].text;
        row.descriptionBullets[0].text = (info.split('\n \n')).length;
      }
      if (row.description) {
        row.description[0].text = row.additionalDescBulletInfo ? row.additionalDescBulletInfo[0].text + ' | ' + row.description[0].text : row.description[0].text;
        row.description[0].text = row.description[0].text.replace(/\n/g, '');
      }
      if (row.warranty) {
        var text = '';
        row.warranty.forEach((ele) => {
          text += ' ' + ele.text;
        });
        row.warranty = [{
          text: text.trim(),
        }];
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.map((ele) => {
          ele.text = ele.text.replace('CompressAll35', '');
          return ele;
        });
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.specifications) {
        let text = '';
        for (var i = 0; i < row.specifications.length; i = i + 2) {
          text += row.specifications[i].text + ': ' + row.specifications[i + 1].text + ' || ';
        }
        row.specifications = [{
          text: (text.slice(0, -2)).trim(),
        }];
      }
      if (row.shippingInfo) {
        var shipText = '';
        shipText = row.shippingInfo[0].text + row.shippingInfo[1].text;
        row.shippingInfo = [
          {
            text: shipText.trim(),
          },
        ];
      }
      if (row.nameExtended) {
        var name = '';
        name = row.brandText ? row.brandText[0].text + ' - ' + row.nameExtended[0].text : row.nameExtended[0].text;
        name = row.color ? name + ' - ' + row.color[0].text : text;
        row.nameExtended[0].text = name.trim();
      }
      if (row.Image360Present) {
        var imagesVal = row.Image360Present[0].text === 'No' ? row.Image360Present[0].text : 'Yes';
        row.Image360Present = [
          {
            text: imagesVal,
          },
        ];
      }
      if (row.aggregateRating) {
        row.aggregateRating[0].text = (row.aggregateRating[0].text.split('out'))[0];
      }
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text.includes('In stock') ? 'In Stock' : row.availabilityText[0].text;
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription = row.manufacturerDescription.map((ele) => {
          ele.text = ele.text.replace(/\n/g, '');
          return ele;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
