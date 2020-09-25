/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

  for (const { group } of data) {
    for (const row of group) {

      try {

        if (row.ratingCount) {
          row.ratingCount = [{ text: row.ratingCount[0].text.split(" ")[2] }];
        }
        if (row.price) {
          row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
        }
        if (row.Image360Present) {
          row.Image360Present = [{ text: row.Image360Present[0].text == 'true' ? 'YES' : 'NO' }];
        }
        if (row.colorCode) {
          let colorCodeJson = row.colorCode[0].text.split(";")[0].split(":")[1];
          row.colorCode = [{ text: colorCodeJson }];
        }

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/●/g, '||').replace(/\n/g, '').slice(3);
        }

        if (row.technicalInformationPdfPresent) {
          row.technicalInformationPdfPresent[0].text = row.technicalInformationPdfPresent[0].text != 'No' ? 'Yes' : 'No';
        }

        if (row.manufacturerImages) {
          let text = '';
          row.manufacturerImages.forEach(item => {
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
          row.specifications.forEach(item => {
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
          row.manufacturerDescription.forEach(item => {
            text += `${item.text}  \n `;
          });
          row.manufacturerDescription = [
            {
              text: text.slice(0, -3),
            },
          ];
        }

      } catch (exception) { console.log('Error in transform', exception); }

    }
  }
  return data;
};

module.exports = { transform };
