const transform = (data) => {
  const clean = text => text.toString()
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
data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  el.text = clean(el.text);
}))));
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
          console.log(item.text)
          if (item.text.includes('Disponible')) {
            newText = 'In Stock';
          } 
           
          else {
            newText = 'Out of Stock';
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
          item.text = item.text.replace(/.*%2Fproduits%2F(.*).mp4.*/, 'https://www.procie.com/datas/products-pictures/produits/$1.mp4');
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
      if (row.warranty) {
        row.warranty.forEach(item => {
          if (item.text.length > 100) {
            item.text = '';
          }
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
            text: text.slice(0, -4),
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};
module.exports = { transform };
