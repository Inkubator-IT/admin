import { useEffect } from "react";

interface MetaTagsProps {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
}

const MetaTags = ({
	title = "Admin Dashboard - Inkubator IT",
	description = "Kelola konten website Inkubator IT dengan mudah",
	keywords = "admin dashboard, inkubator it, blog management, content management",
	image = "/iit-logo.png",
}: MetaTagsProps) => {
	useEffect(() => {
		// Update document title
		document.title = title;

		// Update meta description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", description);
		}

		// Update meta keywords
		const metaKeywords = document.querySelector('meta[name="keywords"]');
		if (metaKeywords) {
			metaKeywords.setAttribute("content", keywords);
		}

		// Update Open Graph tags
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) {
			ogTitle.setAttribute("content", title);
		}

		const ogDescription = document.querySelector(
			'meta[property="og:description"]',
		);
		if (ogDescription) {
			ogDescription.setAttribute("content", description);
		}

		const ogImage = document.querySelector('meta[property="og:image"]');
		if (ogImage) {
			ogImage.setAttribute("content", image);
		}

		// Update Twitter Card tags
		const twitterTitle = document.querySelector('meta[name="twitter:title"]');
		if (twitterTitle) {
			twitterTitle.setAttribute("content", title);
		}

		const twitterDescription = document.querySelector(
			'meta[name="twitter:description"]',
		);
		if (twitterDescription) {
			twitterDescription.setAttribute("content", description);
		}

		const twitterImage = document.querySelector('meta[name="twitter:image"]');
		if (twitterImage) {
			twitterImage.setAttribute("content", image);
		}
	}, [title, description, keywords, image]);

	return null; // This component doesn't render anything
};

export default MetaTags;
