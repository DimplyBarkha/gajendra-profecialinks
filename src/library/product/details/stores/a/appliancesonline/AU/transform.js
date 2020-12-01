/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }))));

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.ratingCount) {
          row.ratingCount = [{ text: row.ratingCount[0].text.split(' ')[2] }];
        }
        if (row.Image360Present) {
          row.Image360Present = [
            { text: row.Image360Present[0].text === 'true' ? 'YES' : 'NO' },
          ];
        }
        if (row.colorCode) {
          const colorCodeJson = row.colorCode[0].text.split(';')[0].split(':')[1];
          row.colorCode = [{ text: colorCodeJson }];
        }

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text
            .replace(/●/g, '||')
            .replace(/\n/g, '')
            .slice(3);
        }

        if (row.technicalInformationPdfPresent) {
          row.technicalInformationPdfPresent[0].text =
            row.technicalInformationPdfPresent[0].text !== 'No' ? 'Yes' : 'No';
        }

        if (row.manufacturerImages) {
          let text = '';
          row.manufacturerImages.forEach((item) => {
            text += `${item.text} | `;
          });
          row.manufacturerImages = [
            {
              text: text.slice(0, -3),
            },
          ];
        }

        if (row.specifications) {
          let text = '';
          row.specifications.forEach((item) => {
            text += `${item.text.replace('\n', ':')} | `;
          });
          row.specifications = [
            {
              text: text.slice(0, -3),
            },
          ];
        }

        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach((item) => {
            text += `${item.text}  \n `;
          });
          row.manufacturerDescription = [
            {
              text: text.slice(0, -3),
            },
          ];
        }
      } catch (exception) {
        console.log('Error in transform', exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
