import { Clock, DollarSign, Eye, Users } from "lucide-react";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { type Job, formatBudget } from "../../data/jobs";

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  applied?: boolean;
}

const categoryColor: Record<string, "blue" | "orange" | "green" | "gray"> = {
  "Web Development":    "blue",
  "UI/UX Design":       "orange",
  "Mobile Development": "blue",
  "Content Writing":    "green",
  "Video Editing":      "gray",
  "Social Media":       "orange",
  "Logo Design":        "green",
  "Photography":        "gray",
  "Data Entry":         "gray",
};

const deadlineColor = (days: number): string => {
  if (days <= 7)  return "text-[#DC2C1E] font-semibold";
  if (days <= 14) return "text-[#EC7211]";
  return "text-[#565A5C]";
};

export default function JobCard({ job, onApply, applied = false }: JobCardProps) {
  return (
    <div className="bg-white border border-[#E7E7E7] rounded-lg p-5 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge label={job.category} color={categoryColor[job.category] ?? "blue"} />
        <span className={`text-xs flex items-center gap-1 flex-shrink-0 ${deadlineColor(job.deadline)}`}>
          <Clock className="w-3.5 h-3.5" />
          {job.deadline} hari
        </span>
      </div>

      {/* Title & Company */}
      <h3 className="text-base font-bold text-[#232F3E] mb-1 line-clamp-2">{job.title}</h3>
      <p className="text-sm text-[#565A5C] mb-3">{job.company}</p>

      {/* Description */}
      <p className="text-sm text-[#232F3E] leading-relaxed mb-3 line-clamp-2">{job.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.skills.map((s) => (
          <span key={s} className="text-xs bg-[#F1F1F1] text-[#565A5C] px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-[#565A5C] mb-4">
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          {formatBudget(job.budget)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {job.applicationCount} pelamar
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Eye className="w-3.5 h-3.5" />
          {job.views}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {applied ? (
          <Button variant="secondary" size="sm" fullWidth disabled>
            Sudah Dilamar
          </Button>
        ) : (
          <Button
            size="sm"
            fullWidth
            onClick={() => onApply?.(job)}
          >
            Lamar
          </Button>
        )}
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <Button variant="secondary" size="sm" fullWidth>
            Detail
          </Button>
        </Link>
      </div>
    </div>
  );
}
