/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.availabilityText) {
          const availabilityTextArr = row.availabilityText.map((item) => {
            return (typeof (item.text) === 'string') && (item.text.includes('en stock')) ? 'In Stock' : 'Out of Stock';
          });
          row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
        }
        if (row.variants) {
          const variantArray = row.variants.map((item) => {
            return item.text;
          });
          row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
        }
        if (row.alternateImages) {
          row.alternateImages.shift();
        }
        if (row.manufacturerImages) {
          const manufacturerImagesArray = row.manufacturerImages.map((item) => {
            return item.text;
          });
          row.manufacturerImages = [{ text: manufacturerImagesArray.join(' | '), xpath: row.manufacturerImages[0].xpath }];
        }
        if (row.nameExtended && row.brandText && row.quantity) {
          row.nameExtended = [{ text: row.brandText[0].text + ' ' + row.nameExtended[0].text + ' ' + row.quantity[0].text, xpath: row.nameExtended[0].xpath }];
        } else if (row.nameExtended && row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' ' + row.nameExtended[0].text, xpath: row.nameExtended[0].xpath }];
        }
        if (row.variantInformation) {
          const variantInformationArray = row.variantInformation.map((item) => {
            return item.text;
          });
          row.variantInformation = [{ text: variantInformationArray.join('/'), xpath: row.variantInformation[0].xpath }];
        }
        if (row.description) {
          const descriptionArray = row.description.map((item) => {
            return typeof (item.text) === 'string' ? item.text.replace(/\n \n/g, ' : ').replace(/\n/g, '') : '||';
          });
          row.description = [{ text: descriptionArray.join(' || '), xpath: row.description[0].xpath }];
        }
        if (row.additionalDescription) {
          const additionalDescriptionArray = row.additionalDescription.map((item) => {
            return item.text;
          });
          row.additionalDescription = [{ text: additionalDescriptionArray.join('|'), xpath: row.additionalDescription[0].xpath }];
        }
        if (row.manufacturerImages) {
          const manufacturerImagesArray = row.manufacturerImages.map((item) => {
            return item.text;
          });
          row.manufacturerImages = [{ text: manufacturerImagesArray.join('|'), xpath: row.manufacturerImages[0].xpath }];
        }
        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};
module.exports = { transform };
