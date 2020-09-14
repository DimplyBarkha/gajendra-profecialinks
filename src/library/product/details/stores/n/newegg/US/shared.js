
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
      if (row.alternateImages) {
        var altImages = row.alternateImages[0].text.split(',');
        row.alternateImages = [];
        altImages.forEach((ele) => {
          var temp = {};
          temp.text = ele.replace('CompressAll', '');
          row.alternateImages.push(temp);
        });
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.largeImageCount && row.alternateImages) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        for (var i = 0; i < row.specifications.length; i = i + 2) {
          text += row.specifications[i].text + ': ' + row.specifications[i + 1].text + ' || ';
        }
        row.specifications = [{
          text: (text.slice(0, -3)).trim(),
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
        var manuDesc = '';
        var flag = false;
        row.manufacturerDescription.forEach((ele) => {
          if (ele.text.includes('{\"duration\"')) {
            flag = true;
          } else {
            manuDesc += '' + ele.text.replace(/\n/g, '');
          }
        });
        if (flag) {
          delete row.manufacturerDescription;
        } else {
          row.manufacturerDescription = [
            {
              text: manuDesc.trim(),
            }];
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
