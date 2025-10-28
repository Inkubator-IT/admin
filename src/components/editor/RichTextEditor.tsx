import { useEditor, EditorContent } from "@tiptap/react";
import { useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	List,
	ListOrdered,
	Image as ImageIcon,
	Link as LinkIcon,
	Heading1,
	Heading2,
	Heading3
} from "lucide-react";

interface RichTextEditorProps {
	content?: any;
	onChange?: (content: any) => void;
	placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				HTMLAttributes: {
					class: "max-w-full h-auto rounded-lg",
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-blue-600 underline",
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: content || "",
		onUpdate: ({ editor }) => {
			onChange?.(editor.getJSON());
		},
		editorProps: {
			attributes: {
				class: "ProseMirror focus:outline-none min-h-[400px] p-4 text-gray-900",
			},
		},
	});

	const addImage = () => {
		fileInputRef.current?.click();
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				editor?.chain().focus().setImage({ src: imageUrl }).run();
			};
			reader.readAsDataURL(file);
		}
		// Reset input file agar bisa upload file yang sama lagi
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const addLink = () => {
		const url = window.prompt("Enter URL:");
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	};

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-gray-300 rounded-lg overflow-hidden">
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileUpload}
				accept="image/*"
				className="hidden"
			/>
			<div className="border-b border-gray-200 bg-gray-50 p-2">
				<div className="flex flex-wrap gap-1">
					<button
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
						title="Bold"
					>
						<Bold className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
						title="Italic"
					>
						<Italic className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						className={`p-1 rounded ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
						title="Underline"
					>
						<Underline className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={`p-1 rounded ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
						title="Strikethrough"
					>
						<Strikethrough className="w-4 h-4" />
					</button>

					<div className="w-px h-6 bg-gray-300 mx-1" />

					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						className={`p-1 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
						title="Heading 1"
					>
						<Heading1 className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						className={`p-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
						title="Heading 2"
					>
						<Heading2 className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
						className={`p-1 rounded ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
						title="Heading 3"
					>
						<Heading3 className="w-4 h-4" />
					</button>

					<div className="w-px h-6 bg-gray-300 mx-1" />

					<button
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
						className={`p-1 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
						title="Align Left"
					>
						<AlignLeft className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
						className={`p-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
						title="Align Center"
					>
						<AlignCenter className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
						className={`p-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
						title="Align Right"
					>
						<AlignRight className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().setTextAlign("justify").run()}
						className={`p-1 rounded ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}`}
						title="Justify"
					>
						<AlignJustify className="w-4 h-4" />
					</button>

					<div className="w-px h-6 bg-gray-300 mx-1" />

					<button
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={`p-1 rounded ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
						title="Bullet List"
					>
						<List className="w-4 h-4" />
					</button>

					<button
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={`p-1 rounded ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
						title="Numbered List"
					>
						<ListOrdered className="w-4 h-4" />
					</button>

					<div className="w-px h-6 bg-gray-300 mx-1" />

					<button
						onClick={addImage}
						className="p-1 rounded hover:bg-gray-200"
						title="Insert Image"
					>
						<ImageIcon className="w-4 h-4" />
					</button>

					<button
						onClick={addLink}
						className="p-1 rounded hover:bg-gray-200"
						title="Insert Link"
					>
						<LinkIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;