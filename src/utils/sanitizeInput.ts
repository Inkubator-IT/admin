import type { TipTapJSON } from "@/services/api";

export function sanitizeText(input: string): string {
	if (!input || typeof input !== "string") return "";
	return input
		.replace(/<[^>]*>/g, "")
		.replace(/&[#\w]+;/g, "")
		.trim()
		.slice(0, 10000); // add limit length and remove html tags/entities
}

export function sanitizeRichText(content: TipTapJSON): TipTapJSON {
	if (!content || !content.content || !Array.isArray(content.content)) {
		return { type: "doc", content: [] };
	}

	const sanitizeNode = (node: any): any => {
		if (!node || typeof node !== "object") return null;

		const sanitized: any = {};
		if (node.type) {
			sanitized.type = node.type;
		}
		if (node.text) {
			sanitized.text = sanitizeText(node.text);
		}
		if (node.marks && Array.isArray(node.marks)) {
			sanitized.marks = node.marks
				.filter((mark: any) => {
					const safeMarks = [
						"bold",
						"italic",
						"underline",
						"strike",
						"link",
						"code",
					];
					return mark && mark.type && safeMarks.includes(mark.type);
				})
				.map((mark: any) => {
					const sanitizedMark: any = { type: mark.type };
					if (mark.type === "link" && mark.attrs) {
						const href = mark.attrs.href || "";
						if (
							href &&
							(href.startsWith("http://") ||
								href.startsWith("https://") ||
								href.startsWith("/"))
						) {
							sanitizedMark.attrs = { href: sanitizeText(href) };
						} else {
							return null;
						}
					}
					return sanitizedMark;
				})
				.filter((mark: any) => mark !== null);
		}

		if (node.attrs && typeof node.attrs === "object") {
			const safeAttrs: any = {};
			if (node.type === "image") {
				if (node.attrs.src) {
					const src = node.attrs.src;
					if (src.startsWith("data:image/")) {
						safeAttrs.src = src;
					}
				}
				if (node.attrs.alt) {
					safeAttrs.alt = sanitizeText(node.attrs.alt);
				}
			} else if (node.type === "heading") {
				if (node.attrs.level && [1, 2, 3, 4, 5, 6].includes(node.attrs.level)) {
					safeAttrs.level = node.attrs.level;
				}
			} else if (node.type === "text-align") {
				const align = node.attrs.align;
				if (["left", "center", "right", "justify"].includes(align)) {
					safeAttrs.align = align;
				}
			}
			if (Object.keys(safeAttrs).length > 0) {
				sanitized.attrs = safeAttrs;
			}
		}

		if (node.content && Array.isArray(node.content)) {
			const sanitizedContent = node.content
				.map(sanitizeNode)
				.filter((n: any) => n !== null);
			if (sanitizedContent.length > 0) {
				sanitized.content = sanitizedContent;
			}
		}

		const safeTypes = [
			"paragraph",
			"heading",
			"bulletList",
			"orderedList",
			"listItem",
			"blockquote",
			"codeBlock",
			"hardBreak",
			"horizontalRule",
			"image",
			"text",
			"textStyle",
			"bold",
			"italic",
			"underline",
			"strike",
			"code",
			"link",
		];
		if (!sanitized.type || !safeTypes.includes(sanitized.type)) {
			return null;
		}
		return sanitized;
	};

	const sanitizedContent = content.content
		.map(sanitizeNode)
		.filter((node: any) => node !== null);

	return {
		type: "doc",
		content: sanitizedContent,
	};
}

export function sanitizeTagName(input: string): string {
	if (!input || typeof input !== "string") return "";
	return input
		.replace(/<[^>]*>/g, "")
		.replace(/&[#\w]+;/g, "")
		.trim()
		.slice(0, 100); // remove html tags/entities and add limit length
}

export function sanitizeTagDescription(input: string): string {
	if (!input || typeof input !== "string") return "";
	return input
		.replace(/<[^>]*>/g, "")
		.replace(/&[#\w]+;/g, "")
		.trim()
		.slice(0, 500); // remove html tags/entities and add limit length
}
