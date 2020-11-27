/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.trim().includes('Online')) ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.category) {
        const categoryArray = row.category.map((item) => {
          return item.text.trim();
        });
        categoryArray.shift();
        row.category = categoryArray.map((item) => {
          return { text: item, xpath: row.category[0].xpath };
        });
      }
      if (row.attributesNotesCustom) {
        const attributesNotesCustomArray = row.attributesNotesCustom.map((item) => {
          return item.text.trim();
        });
        const description = row.description ? row.description[0].text : '';
        row.description = [{ text: description + '|' + attributesNotesCustomArray.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.image) {
        let image = row.image[0].text.trim();
        image = image.substring(0, image.lastIndexOf('?'));
        row.image = [{ text: image, xpath: row.image[0].xpath }];
      }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim().substring(0, item.text.lastIndexOf('?')) : '';
        });
        row.alternateImages = [{ text: alternateImagesArr.join('|'), xpath: row.alternateImages[0].xpath }];
        row.secondaryImageTotal = [{ text: alternateImagesArr.length, xpath: row.alternateImages[0].xpath }];
      }
      if (row.productOtherInformation) {
        const productOtherInformationArr = row.productOtherInformation.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        row.productOtherInformation = [{ text: productOtherInformationArr.join('|'), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.videoLength) {
        const videoLength = row.videoLength[0].text.split('/')[1].trim();
        row.videoLength = [{ text: videoLength, xpath: row.videoLength[0].xpath }];
      }
    }
  }

  const clean = text =>
    text
      .toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
