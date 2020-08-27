/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach((item) => {
          text += `${item.text.replace(/\n \n/g, ' | ')}  `;
        });
        row.description = [
          {
            text: text,
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
      if (row.alternateImages) {
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.termsAndConditions) {
        row.termsAndConditions = [
          {
            text: 'Yes',
          },
        ];
      } else {
        row.termsAndConditions = [
          {
            text: 'No',
          },
        ];
      }
      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text;
        row.availabilityText[0].text = availabilityText.includes('In Stock') ? 'In Stock' : 'Out of Stock';
      }
    }
  }
  return data;
};

module.exports = { transform };
