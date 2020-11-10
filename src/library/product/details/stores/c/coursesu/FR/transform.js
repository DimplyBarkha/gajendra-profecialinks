/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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

  for (const { group } of data) {
    for (const row of group) {
    //   if (row.alternateImages) {
    //     if (row.alternateImages.length > 0) {
    //       row.secondaryImageTotal = [
    //         {
    //           text: row.alternateImages.length - 1,
    //         },
    //       ];
    //     }
    //   }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text} `;
        });
        row.ingredientsList = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      //   if (row.shippingDimensions) {
      //     let text = '';
      //     row.shippingDimensions.forEach(item => {
      //       text += `${item.text}`;
      //     });
      //     row.shippingDimensions = [
      //       {
      //         text: cleanUp(text),
      //       },
      //     ];
      //   }
      //   if (row.manufacturerDescription) {
      //     let text = '';
      //     row.manufacturerDescription.forEach(item => {
      //       text += `${item.text}`;
      //     });
      //     row.manufacturerDescription = [
      //       {
      //         text: cleanUp(text),
      //       },
      //     ];
      //   }
      //   if (row.specifications) {
      //     let text = '';
      //     row.specifications.forEach(item => {
      //       text += `${item.text} || `;
      //     });
      //     row.specifications = [
      //       {
      //         text: cleanUp(text.slice(0, -3)),
      //       },
      //     ];
      //   }
      //   if (row.shippingWeight) {
      //     let text = '';
      //     row.shippingWeight.forEach(item => {
      //       text = item.text;
      //     });
      //     row.shippingWeight = [
      //       {
      //         text: cleanUp(text),
      //       },
      //     ];
      //   }
      if (row.aggregateRating) {
        let rating;
        if (row.aggregateRating[0].text) {
          rating = parseInt(row.aggregateRating[0].text);
          rating = (rating / 100) * 5;
        }

        row.aggregateRating = [
          {
            text: cleanUp(rating),
          },
        ];
      }
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.split(',')[1];
          }
        });
        row.weightNet = [
          {
            text: cleanUp(text.trim()),
          },
        ];
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = cleanUp(el.text);
  }))));

  return data;
};
module.exports = { transform };
