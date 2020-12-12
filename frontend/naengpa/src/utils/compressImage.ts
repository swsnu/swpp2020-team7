/* eslint consistent-return: 0 */

/* Compress Image */
const compressImage = (file: File) => {
	const compressedImage = file;

	const image = document.createElement('img');
	image.src = URL.createObjectURL(file);
	image.onload = () => {
		URL.revokeObjectURL(image.src);
		const canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 200;
		const context = canvas.getContext('2d');
		const draw = () => context?.drawImage(image, 0, 0, 200, 200);
		draw();
		const getBlob = () =>
			context?.canvas.toBlob(
				(newImageBlob) => {
					if (newImageBlob) {
						const func = () => {
							return new File([newImageBlob], file.name);
						}
						return func();
					}
				},
				'images/jpg',
				0.5,
			);
		getBlob();
	};
	return compressedImage;
};

export default compressImage;
