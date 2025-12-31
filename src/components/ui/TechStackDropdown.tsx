import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

interface TechStack {
	tech_stack_id: number;
	tech_stack_name: string;
	tech_stack_description?: string;
	icon_url?: string;
}

interface TechStackDropdownProps {
	techStacks: TechStack[];
	selectedTechStackIds: number[];
	onTechStackChange: (techStackIds: number[]) => void;
	placeholder?: string;
}

const TechStackDropdown = ({
	techStacks,
	selectedTechStackIds,
	onTechStackChange,
	placeholder = "Select tech stacks...",
}: TechStackDropdownProps) => {
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

	const handleTechStackToggle = (techStackId: number) => {
		const newSelectedIds = selectedTechStackIds.includes(techStackId)
			? selectedTechStackIds.filter((id) => id !== techStackId)
			: [...selectedTechStackIds, techStackId];
		onTechStackChange(newSelectedIds);
	};

	const handleRemoveTechStack = (
		techStackId: number,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();
		const newSelectedIds = selectedTechStackIds.filter(
			(id) => id !== techStackId,
		);
		onTechStackChange(newSelectedIds);
	};

	const selectedTechStacks = techStacks.filter((techStack) =>
		selectedTechStackIds.includes(techStack.tech_stack_id),
	);

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white"
			>
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap gap-1 min-h-[20px]">
						{selectedTechStacks.length > 0 ? (
							selectedTechStacks.map((techStack) => (
								<span
									key={techStack.tech_stack_id}
									className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
								>
									{techStack.icon_url && (
										<img
											src={techStack.icon_url}
											alt={techStack.tech_stack_name}
											className="w-3 h-3 object-contain"
										/>
									)}
									{techStack.tech_stack_name}
									<button
										onClick={(e) =>
											handleRemoveTechStack(techStack.tech_stack_id, e)
										}
										className="hover:bg-blue-200 rounded-full p-0.5"
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
					{techStacks.length === 0 ? (
						<div className="px-3 py-2 text-sm text-gray-500">
							No tech stacks available
						</div>
					) : (
						techStacks.map((techStack) => (
							<div
								key={techStack.tech_stack_id}
								onClick={() =>
									handleTechStackToggle(techStack.tech_stack_id)
								}
								className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
							>
								<div className="flex items-center gap-2">
									{techStack.icon_url && (
										<img
											src={techStack.icon_url}
											alt={techStack.tech_stack_name}
											className="w-5 h-5 object-contain"
										/>
									)}
									<span className="text-sm text-gray-900">
										{techStack.tech_stack_name}
									</span>
								</div>
								{selectedTechStackIds.includes(techStack.tech_stack_id) && (
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

export default TechStackDropdown;

