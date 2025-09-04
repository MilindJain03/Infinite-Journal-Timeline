import { useState, type FormEvent } from "react";
import type { JournalEntry } from "../../types/types";
import { type NewJournalEntryData } from "../../context/JournalProvider";

type JournalFormProps = {
  onSubmit: (data: NewJournalEntryData | JournalEntry) => void;
  onCancel: () => void;
  initialData?: JournalEntry;
  date: string;
};

export default function JournalForm({
  onSubmit,
  onCancel,
  initialData,
  date,
}: JournalFormProps) {
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    categories: initialData?.categories.join(", ") || "",
    rating: initialData?.rating || 3,
    imgUrl: initialData?.imgUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.imgUrl) {
      alert("Please provide an image URL.");
      return;
    }
    const finalData = {
      ...initialData,
      ...formData,
      date,
      categories: formData.categories.split(",").map((cat) => cat.trim()),
      rating: Number(formData.rating),
    };
    onSubmit(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] max-w-full bg-white rounded-lg shadow-xl p-6 space-y-4 mx-4"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Edit" : "Add"} Journal for {date}
      </h2>
      
      <div>
        <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-600">Image URL</label>
        <input type="text" id="imgUrl" name="imgUrl" value={formData.imgUrl} onChange={handleChange} placeholder="https://example.com/image.png" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400" />
        {formData.imgUrl && <img src={formData.imgUrl} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-600">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400" />
      </div>

      <div>
        <label htmlFor="categories" className="block text-sm font-medium text-gray-600">Categories (comma-separated)</label>
        <input type="text" id="categories" name="categories" value={formData.categories} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400" />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-600">Rating: {formData.rating} / 5</label>
        <input type="range" id="rating" name="rating" min="1" max="5" step="0.1" value={formData.rating} onChange={handleChange} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md shadow-sm hover:bg-blue-500">{initialData ? "Save Changes" : "Create Journal"}</button>
      </div>
    </form>
  );
}