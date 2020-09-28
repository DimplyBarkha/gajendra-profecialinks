
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.Image360Present) {				
				let newText = 'No';
				row.Image360Present.forEach(item => {                    			
					if (item.text.trim() > 0) {
						newText = 'YES';
					}
				});
				row.Image360Present = [{ text: newText }];
			}
			
			if (row.description) {				
				let newText = '';
				row.description.forEach(item => {
					newText +=  `${item.text.trim() + ' || '}`;
				});
				
				row.description = [{ text: newText.slice(0, -4) }];
			}
			
			if (row.brandLink) {				
				let newText = "https://www.bunnings.com.au";
				row.brandLink.forEach(item => {                    			
					newText = newText + item.text.trim();
				});

				row.brandLink = [{ text: newText }];
			}
		
			if (row.shippingDimensions) {				
				let newText = '';
				row.shippingDimensions.forEach(item => {                			
					newText +=  `${item.text.trim() + ' X '}`;
				});
				
				row.shippingDimensions = [{ text: newText.slice(0, -3) }];
			}
			
			if (row.specifications) {				
				let newText = '';
				row.specifications.forEach(item => {            			
					newText +=  `${item.text.trim() + ' X '}`;
				});

				row.specifications = [{ text: newText.slice(0, -3) }];
			}
			
			if (row.additionalDescBulletInfo) {				
				let newText = "";
				row.additionalDescBulletInfo.forEach(item => {                 			
					newText +=  `${item.text.trim() + ' || '}`;
				});

				row.additionalDescBulletInfo = [{ text: newText.slice(0, -4) }];
			}

			if (row.technicalInformationPdfPresent) {				
				let newText = "No";
				row.technicalInformationPdfPresent.forEach(item => {
					if (item.text.trim().includes(".pdf")) {
						newText = "Yes";
					}
				});

				row.technicalInformationPdfPresent = [{ text: newText }];
			}

			if (row.videos) {
				row.videos = [{ text: row.videos[0].text.slice(5) }];
			}

			if (row.sku) {
				row.sku = [{ text: row.sku[0].text.slice(5) }];
			}

			if (row.nameExtended) {
				let newText = "";
				row.nameExtended.forEach(item => {
				  if (item.text.trim().includes(row.brandText[0].text.trim())){
					newText += `${item.text.trim()}`;
				  } else {
					newText += `${row.brandText[0].text.trim() + ' ' + item.text.trim()}`;
				  }
				});    
				   
				row.nameExtended = [{ text: newText }];
			  }
		}
	}

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

	return data;
};

module.exports = { transform };