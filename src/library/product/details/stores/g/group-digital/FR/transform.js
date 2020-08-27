/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended) {
        let specs = '';
        row.nameExtended.forEach(item => {
          specs += `${item.text} `;
        });
        row.nameExtended = [
          {
            text: specs,
          },
        ];
      }
      if (row.description) {
        let specs = '';
        row.description.forEach(item => {
          specs += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.description = [
          {
            text: cleanUp(specs.slice(0, -3)),
          },
        ];
      }
      if (row.specifications) {
        let specs = '';
        row.specifications.forEach(item => {
          specs += `${item.text} || `;
        });
        row.specifications = [
          {
            text: cleanUp(specs.slice(0, -3)),
          },
        ];
      }

      if (row.image) {
        let specs = '';
        row.image.forEach(item => {
          specs += `${item.text.replace('thumbnail', 'image').replace('120x', '800x')}`;
        });
        row.image = [
          {
            text: specs,
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach((item, index) => {
          row.alternateImages.splice(index, 1, { text: `${item.text.replace('thumbnail', 'image').replace('120x', '800x')}` });
        });
      }
      if (row.aggregateRating) {
        const txt = Number(row.aggregateRating[0].text) / 20;
        row.aggregateRating = [
          {
            text: txt,
          },
        ];
      }
      if (row.shippingInfo) {
        let specs = '';
        row.shippingInfo.forEach(item => {
          specs += `${item.text} `;
        });
        row.shippingInfo = [
          {
            text: specs,
          },
        ];
      }
      if (row.weightNet) {
        let specs = '';
        row.weightNet.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.weightNet = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.shippingWeight) {
        let specs = '';
        row.shippingWeight.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.shippingWeight = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.shippingDimensions) {
        let specs = '';
        row.shippingDimensions.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.shippingDimensions = [
          {
            text: specs.trim(),
          },
        ];
      }

      // if (row.category) {
      //     let text = '';
      //     row.category.forEach(item => {
      //         text += `${item.text.replace(/|/g, '')}`;
      //     });
      //     row.category = [
      //         {
      //             text: cleanUp(text),
      //         },
      //     ];
      // }
      // // if (row.weightNet) {
      //     let text = '';
      //     row.weightNet.forEach(item => {
      //         text += `${item.text.replace(/\n \n/g, ':')}`;
      //     });
      //     row.weightNet = [
      //         {
      //             text: cleanUp(text),
      //         },
      //     ];
      // }
      // if (row.shippingDimensions) {
      //     let text = '';
      //     row.shippingDimensions.forEach(item => {
      //         text += `${item.text.replace(/\n \n/g, ':')} | `;
      //     });
      //     row.shippingDimensions = [
      //         {
      //             text: cleanUp(text.slice(0, -3)),
      //         },
      //     ];
      // }
      // if (row.manufacturerDescription) {
      //     let text = '';
      //     row.manufacturerDescription.forEach(item => {
      //         text += item.text.replace(/\n \n/g, ' ').replace('Content from the Manufacturer', '');
      //     });
      //     row.manufacturerDescription = [
      //         {
      //             text: cleanUp(text),
      //         },
      //     ];
      // }
      // if (row.description || row.descriptionBulletsLiTags) {
      //     const description = row.description;
      //     let textOne = '';
      //     description && description.length && description.forEach(item => {
      //         textOne += `${item.text.replace(/\n \n/g, '')}`;
      //     });
      //     textOne = textOne.trim();
      //     let textTwo = '';
      //     const descriptionLiTags = row.descriptionBulletsLiTags;
      //     descriptionLiTags && descriptionLiTags.length && descriptionLiTags.forEach(item => {
      //         textTwo += ` || ${item.text.replace(/\n \n/g, '')}`;
      //     });
      //     textTwo = textTwo.trim();
      //     const data = [textOne, textTwo];
      //     row.description = [
      //         {
      //             text: cleanUp(data.join(' ')),
      //         },
      //     ];
      // }
    }
  }
  return data;
};

module.exports = { transform };
