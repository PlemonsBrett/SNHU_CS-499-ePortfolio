import { useState } from "react";

export const useImageGalleryState = (totalImages: number) => {
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const handleNextImage = () => {
		setActiveImageIndex((prevIndex) =>
			prevIndex + 1 >= totalImages ? 0 : prevIndex + 1,
		);
	};

	const handlePrevImage = () => {
		setActiveImageIndex((prevIndex) =>
			prevIndex - 1 < 0 ? totalImages - 1 : prevIndex - 1,
		);
	};

	return {
		activeImageIndex,
		handleNextImage,
		handlePrevImage,
	};
};