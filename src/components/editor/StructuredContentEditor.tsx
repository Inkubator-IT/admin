import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { ContentBlock, ContentBlockType } from "@/services/api/types";

interface StructuredContentEditorProps {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
}

const StructuredContentEditor = ({ content, onChange }: StructuredContentEditorProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(content || []);

  const updateBlocks = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      type,
      text: "",
    };
    updateBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    updateBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const getBlockStyle = (type: ContentBlockType) => {
    switch (type) {
      case "header":
        return "text-2xl font-bold";
      case "quote":
        return "italic border-l-4 border-blue-500 pl-4";
      default:
        return "";
    }
  };

  const getPlaceholder = (type: ContentBlockType) => {
    switch (type) {
      case "header":
        return "Enter header text...";
      case "quote":
        return "Enter quote text...";
      default:
        return "Enter paragraph text...";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => addBlock("header")}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Header
        </button>
        <button
          type="button"
          onClick={() => addBlock("quote")}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Quote
        </button>
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No content blocks yet</p>
          <p className="text-sm text-gray-400">Click the buttons above to add your first block</p>
        </div>
      )}

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => moveBlock(index, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, "down")}
                  disabled={index === blocks.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <GripVertical className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={block.type}
                    onChange={(e) => updateBlock(index, { type: e.target.value as ContentBlockType })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="header">Header</option>
                    <option value="quote">Quote</option>
                  </select>
                  <span className="text-xs text-gray-500">Block {index + 1}</span>
                </div>

                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(index, { text: e.target.value })}
                  placeholder={getPlaceholder(block.type)}
                  rows={block.type === "paragraph" ? 6 : 2}
                  className={`w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${getBlockStyle(
                    block.type
                  )}`}
                />
              </div>

              <button
                type="button"
                onClick={() => deleteBlock(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded mt-8"
                title="Delete block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructuredContentEditor;
