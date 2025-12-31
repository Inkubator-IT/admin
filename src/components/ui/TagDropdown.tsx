import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

interface Tag {
	id: number;
	name: string;
	color: string;
}

interface TagDropdownProps {
	tags: Tag[];
	selectedTagIds: number[];
	onTagChange: (tagIds: number[]) => void;
	placeholder?: string;
}

const TagDropdown = ({
	tags,
	selectedTagIds,
	onTagChange,
	placeholder = "Select tags...",
}: TagDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleTagToggle = (tagId: number) => {
		const newSelectedIds = selectedTagIds.includes(tagId)
			? selectedTagIds.filter((id) => id !== tagId)
			: [...selectedTagIds, tagId];
		onTagChange(newSelectedIds);
	};

	const handleRemoveTag = (tagId: number, event: React.MouseEvent) => {
		event.stopPropagation();
		const newSelectedIds = selectedTagIds.filter((id) => id !== tagId);
		onTagChange(newSelectedIds);
	};

	const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap gap-1 min-h-[20px]">
						{selectedTags.length > 0 ? (
							selectedTags.map((tag) => (
								<span
									key={tag.id}
									className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
									style={{ backgroundColor: tag.color }}
								>
									{tag.name}
									<button
										onClick={(e) => handleRemoveTag(tag.id, e)}
										className="hover:bg-white/20 rounded-full p-0.5"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))
						) : (
							<span className="text-gray-500">{placeholder}</span>
						)}
					</div>
					<ChevronDown
						className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</div>
			</div>

			{isOpen && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
					{tags.length === 0 ? (
						<div className="px-3 py-2 text-sm text-gray-500">
							No tags available
						</div>
					) : (
						tags.map((tag) => (
							<div
								key={tag.id}
								onClick={() => handleTagToggle(tag.id)}
								className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: tag.color }}
									/>
									<span className="text-sm text-gray-900">{tag.name}</span>
								</div>
								{selectedTagIds.includes(tag.id) && (
									<Check className="w-4 h-4 text-blue-600" />
								)}
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default TagDropdown;
