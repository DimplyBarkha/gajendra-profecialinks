/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr
      .replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '" ')
      .replace(/\s{1,}"/g, ' "')
      .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
      // if (row.image) {
      //   row.image.forEach((str) => {
      //     str.text = str.text.replace(/380x240/g, "380x500");
      //   });
      // }
      if (row.alternateImages) {
        row.alternateImages.shift();
        // row.alternateImages.forEach((str) => {
        //   str.text = str.text.replace(/380x240/g, "380x500");
        // });
      }
      if (row.manufacturerImages) {
        // row.manufacturerImages.shift();
        row.manufacturerImages.forEach((str) => {
          if (str.text.includes('upload')) {
            str.text = 'https://www.eldorado.ru' + str.text;
          } else if (str.text.includes('syndication')) {
            str.text = 'https:' + str.text;
          }
        });
      }
      if (row.specifications) {
        const formattedSpecifications = row.specifications
          .map((item, index) =>
            index == row.specifications.length - 1 ? item.text : index % 2 === 0 ? item.text + ' : ' : item.text + ' || ',
          )
          .join('');
        row.specifications = [];
        row.specifications.push({ text: '' });
        row.specifications[0].text = formattedSpecifications;
      }
      if (row.description) {
        const description = row.description.map((str) => {
          return str.text.replace(/\n/g, ' ');
        }).join('');
        row.description = [];
        row.description.push({ text: '' });
        row.description[0].text = description;
      }
      // if (row.manufacturerDescription) {
      //   const manufacturerDescription = row.manufacturerDescription
      //     .map((str, index) => {
      //       str.text = str.text.replace(/\n/g, ' ');
      //       return index == row.manufacturerDescription.length - 1 ? str.text : str.text + ' | ';
      //     })
      //     .join('');
      //   row.manufacturerDescription = [{ text: '' }];
      //   row.manufacturerDescription[0].text = manufacturerDescription;
      // }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = row.manufacturerDescription.map(elm => elm.text).join(' ');
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.shippingInfo) {
        const shippingInfo = row.shippingInfo.map((str) => {
          return str.text.replace(/\n/g, '');
        });

        row.shippingInfo[0].text = shippingInfo;
      }
      if (row.availabilityText) {
        row.availabilityText.forEach((str) => {
          str.text = str.text == 'true' ? 'In Stock' : 'Out of Stock';
        });
      }
      if (row.Image360Present) {
        const Image360Present = row.Image360Present.map((str) => {
          return str.text == 'true' ? 'Yes' : 'No';
        }).join('');

        row.Image360Present[0].text = Image360Present;
      }
      if (row.technicalInformationPdfPresent) {
        const technicalInformationPdfPresent = row.technicalInformationPdfPresent
          .map((str) => {
            return str.text == 'true' ? 'Yes' : 'No';
          })
          .join('');

        row.technicalInformationPdfPresent[0].text = technicalInformationPdfPresent;
      }
      if (row.category) {
        row.category.shift();
        // const category = row.category
        //   .map((category) => {
        //     return category.text.split(">").splice(1).join(",");
        //   })
        //   .join("");

        // row.category[0].text = category;
      }
      row = cleanUp(row);
    }
  }
  return data;
};

module.exports = { transform };
