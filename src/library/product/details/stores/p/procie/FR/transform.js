const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          if (item.text !== 'No') {
            item.text = item.text.replace(/(.*)/, 'Yes');
          }
        });
      }
      if (row.availabilityText) {
        let newText = '';
        row.availabilityText.forEach(item => {
          if ((!item.text.includes('Out of Stock') && (!item.text.includes('Disponible')))) {
            newText = 'Out of Stock';
          } else {
            newText = 'In Stock';
          }
          item.text = newText;
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          if (!item.text.includes('https://www.procie.com')) {
            item.text = 'https://www.procie.com/' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.procie.com' + item.text.replace(/&size=.*/, '&size=400');
        });
        row.alternateImages = row.alternateImages.splice(1);
      }
      if (row.videos) {
        row.videos.forEach(item => {
          item.text = 'https://www.procie.com/' + item.text;
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\r\n|\n|\r)/gm, '').replace(/\s{2,}/gm, ' ');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace('/product?ProductId=', '');
        });
      }
      if (row.color) {
        row.color.forEach(item => {
          item.text = item.text.replace('- Couleur:', '');
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += (item.text + ' : ');
          } else {
            text += (item.text) + ' || ';
          }
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach((item, index) => {
          if (index % 2 === 0) {
            text += (item.text + ' : ');
          } else {
            text += (item.text) + ' | ';
          }
        });
        row.productOtherInformation = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach((item, index) => {
          if (index % 2 === 0) {
            text += (item.text + ' : ');
          } else {
            text += (item.text) + ' | ';
          }
        });
        row.weightNet = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.weightGross) {
        let text = '';
        row.weightGross.forEach((item, index) => {
          if (index % 2 === 0) {
            text += (item.text + ' : ');
          } else {
            text += (item.text) + ' | ';
          }
        });
        row.weightGross = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
