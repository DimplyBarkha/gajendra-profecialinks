/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.color) {
        const product = JSON.parse(row.color[0].text);
        row.color[0].text = product.color;
      }
      if (row.description) {
        let i = 0;
        for (let desc of row.description) {
          row.description[i].text = desc.text.split('\n')[0];
          i++;
        }
      }
      if (row.availabilityText) {
        const product = JSON.parse(row.availabilityText[0].text);
        row.availabilityText[0].text = product.offers.availability.replace('http://schema.org/', '');
        if (row.availabilityText[0].text == 'InStock') {
          row.availabilityText[0].text = 'In Stock';
        }
      }
      // if (row.alternateImages) {
      //   try {
      //     var regex = /(\/)(?!.*\/)(.*_)(.*)(\.)/g;
      //     var regex1 = /(\/)(?!.*\/)(.*_)(.*)(\.)/g;

      //     const altImgs = row.alternateImages;
      //     if (altImgs && altImgs.length > 1) {
      //       const prevImage = altImgs[0];
      //       const nextImage = altImgs[altImgs.length - 1];
      //       const match1 = regex.exec(prevImage.text);
      //       const match2 = regex1.exec(nextImage.text);
      //       const endNumber = Number(match1[3]);
      //       const startNumber = Number(match2[3]);
      //       const newAltImg = [];
      //       for (let i = startNumber; i <= endNumber; i++) {
      //         newAltImg.push({
      //           text: prevImage.text.replace(`_${endNumber}.`, `_${i}.`),
      //           xpath: prevImage.xpath
      //         })
      //       }
      //       row.alternateImages = newAltImg;
      //     }
      //   }
      //   catch { }
      // }
    }
  }
  return data;
};

module.exports = { transform };