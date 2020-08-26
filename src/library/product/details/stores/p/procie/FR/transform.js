const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'Yes');
        });
      }
      if (row.availabilityText) {
        let newText = '';
        row.availabilityText.forEach(item => {
          if ((!item.text.includes('Out of Stock') && (!item.text.includes('DISPONIBLE')))) {
            item.text = item.text.replace(/(.*)/, 'Yes');
            newText = 'Out of Stock'
          }
          else{
            newText = 'In Stock'
          }
          item.text = newText
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.procie.com/' + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.procie.com/' + item.text.replace(/&size=.*/, '&size=400');
        });
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
      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          item.text = item.text.replace(/(\r\n|\n|\r)/gm, '').replace(/\s{2,}/gm, ' ');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace('/product?ProductId=', '');
        });
      }
      if(row.color){
        row.color.forEach(item => {
          item.text = item.text.replace('- Couleur:','');
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace('x','||');
        });
      }
      if (row.productOtherInformation) {
        const text = [];
        for (const item of row.productOtherInformation) {
          text.push(item.text.replace(/\n/gm, ' ').trim());
        }
        row.productOtherInformation = [{ text: text.join(' || ') }];
      }
    }
  }
  return data;
};
module.exports = { transform };