"use client";
import { X } from "lucide-react";
import { CATEGORIES, SKILLS_LIST } from "../../data/jobs";

export interface Filters {
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadlineMax: number;
  skills: string[];
  search: string;
}

const DEFAULT_FILTERS: Filters = {
  category: "Semua Kategori",
  budgetMin: 0,
  budgetMax: 20000000,
  deadlineMax: 60,
  skills: [],
  search: "",
};

interface JobFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}

export { DEFAULT_FILTERS };

export default function JobFilters({ filters, onChange, resultCount }: JobFiltersProps) {
  const set = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    onChange({ ...filters, [key]: val });

  const toggleSkill = (skill: string) => {
    const next = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    set("skills", next);
  };

  const hasActiveFilters =
    filters.category !== "Semua Kategori" ||
    filters.skills.length > 0 ||
    filters.budgetMax < 20000000 ||
    filters.deadlineMax < 60;

  return (
    <aside className="bg-white border border-[#E7E7E7] rounded-lg p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#232F3E]">Filter</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#565A5C]">{resultCount} lowongan</span>
          {hasActiveFilters && (
            <button
              onClick={() => onChange({ ...DEFAULT_FILTERS, search: filters.search })}
              className="text-xs text-[#DC2C1E] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#232F3E] mb-2">Kategori</label>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => set("category", cat)}
                className="w-3.5 h-3.5 accent-[#DC3545]"
              />
              <span className={`text-sm ${filters.category === cat ? "text-[#DC3545] font-semibold" : "text-[#232F3E]"}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget range */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#232F3E] mb-2">
          Budget Maks.
          <span className="ml-1 font-normal text-[#565A5C]">
            s/d Rp {(filters.budgetMax / 1000000).toFixed(0)}jt
          </span>
        </label>
        <input
          type="range"
          min={500000}
          max={20000000}
          step={500000}
          value={filters.budgetMax}
          onChange={(e) => set("budgetMax", Number(e.target.value))}
          className="w-full accent-[#DC3545]"
        />
        <div className="flex justify-between text-xs text-[#565A5C] mt-1">
          <span>500K</span>
          <span>20jt</span>
        </div>
      </div>

      {/* Deadline */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#232F3E] mb-2">
          Deadline Maks.
          <span className="ml-1 font-normal text-[#565A5C]">{filters.deadlineMax} hari</span>
        </label>
        <input
          type="range"
          min={7}
          max={60}
          step={7}
          value={filters.deadlineMax}
          onChange={(e) => set("deadlineMax", Number(e.target.value))}
          className="w-full accent-[#DC3545]"
        />
        <div className="flex justify-between text-xs text-[#565A5C] mt-1">
          <span>7 hari</span>
          <span>60 hari</span>
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-[#232F3E] mb-2">Skill</label>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {SKILLS_LIST.map((skill) => {
            const active = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[#DC3545] text-white border-[#DC3545]"
                    : "bg-white text-[#565A5C] border-[#CCCCCC] hover:border-[#DC3545] hover:text-[#DC3545]"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
