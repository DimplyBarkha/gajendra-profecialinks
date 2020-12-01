
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.specifications) {
				let text = '';
				row.specifications.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				text = text.replace(/\r\n|\r|\n/g, '');
				row.specifications = [
					{
						text: text.slice(0, -4),
					},
				];
			}

			if (row.additionalDescBulletInfo) {
				let text = '';
				row.additionalDescBulletInfo.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				text = text.replace(/\r\n|\r|\n/g, '');
				row.additionalDescBulletInfo = [
					{
						text: text.slice(0, -4),
					},
				];
			}

			// if (row.price) {
			// 	let price = '';
			// 	let currency = '';
			// 	row.price.forEach(item => {
			// 		price = item.text.substring(0,item.text.indexOf("|"));
			// 		currency = item.text.substring(item.text.indexOf("|") + 1);
			// 	});
			// 	row.price = [
			// 	  {text: price},
			// 	  {text: currency}
			// 	];
			// }

			// if (row.price) {			
			// 	var temp=row.price[0].text.split(':');			
			// 	row.price = [{ text: temp[0] }, { text: temp[1] }];
			//   } 

			if (row.description) {
				let text = '';
				row.description.forEach(item => {
					text += `${item.text.replace(/\r\n|\r|\n/g, '.')} || `;
				});
				text = text.replace(/\r\n|\r|\n/g, '');
				let temp = text.split('.');
				row.description = [
					{
						text: text.slice(0, -4),
					},
				];
			}

			if (row.availabilityText) {
				let text = '';
				row.availabilityText.forEach(item => {
					if (item.text == "1") {
						text = "In Stock.";
					}
					else {
						text = "Out of Stock";
					}
				});
				row.availabilityText = [
					{
						text: text,
					},
				];
			}

			if (row.quantity) {
				let text = '';
				row.quantity.forEach(item => {
					if (item.text.indexOf("stk") !== -1) {
						text = item.text
					}
					else {
						text = "";
					}
				});
				row.quantity = [
					{
						text: text,
					},
				];
			}

			if (row.shippingWeight) {
				let tempshippingWeight = row.shippingWeight[0].text.split(':');
				if (tempshippingWeight.length > 0) {
					row.shippingWeight = [{ text: tempshippingWeight[1].replace(' ', '') }];
				}
			}

			if (row.shippingDimensions) {
				let tempshippingDimensions = row.shippingDimensions[0].text.split(':');
				if (tempshippingDimensions.length > 0) {
					row.shippingDimensions = [{ text: tempshippingDimensions[1].replace(' ', '') }];
				}
			}

			/* if (row.shippingDimensions) {
				let text = '';
				row.shippingDimensions.forEach(item => {
					if(item.text.indexOf("cm") !== -1){
						text = item.text
					}
					else {
						text = "";
					}
				});
				row.shippingDimensions = [
					{
						text: text,
					},
				];
			} */

			if (row.technicalInformationPdfPresent) {
				let text = '';
				row.technicalInformationPdfPresent.forEach(item => {
					if (item.text) {
						text = "Yes"
					}
					else {
						text = "No";
					}
				});
				row.technicalInformationPdfPresent = [
					{
						text: text,
					},
				];
			}
			else {
				row.technicalInformationPdfPresent = [
					{
						text: 'No',
					},
				];
			}

			if (row.termsAndConditions) {
				row.termsAndConditions = [
					{
						text: 'No',
					},
				];
			}
			else {
				row.termsAndConditions = [
					{
						text: 'No',
					},
				];
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