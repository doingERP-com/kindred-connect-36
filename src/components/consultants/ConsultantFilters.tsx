import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ConsultantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  experienceFilter: string;
  onExperienceChange: (value: string) => void;
  categories: string[];
}

export const ConsultantFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  experienceFilter,
  onExperienceChange,
  categories,
}: ConsultantFiltersProps) => {
  return (
    <div className="glass-card p-6 rounded-2xl mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, or skills..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Project Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <Select value={experienceFilter} onValueChange={onExperienceChange}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            <SelectItem value="0-5">0-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
