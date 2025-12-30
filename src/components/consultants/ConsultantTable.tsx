import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Briefcase, Star } from "lucide-react";
import { Consultant, getSkillsFromConsultant } from "@/hooks/useConsultants";

interface ConsultantTableProps {
  consultants: Consultant[];
}

export const ConsultantTable = ({ consultants }: ConsultantTableProps) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-primary font-semibold">Consultant</TableHead>
            <TableHead className="text-primary font-semibold">Title</TableHead>
            <TableHead className="text-primary font-semibold">Location</TableHead>
            <TableHead className="text-primary font-semibold">Experience</TableHead>
            <TableHead className="text-primary font-semibold">Skills</TableHead>
            <TableHead className="text-primary font-semibold">Rate</TableHead>
            <TableHead className="text-primary font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => {
            const skills = getSkillsFromConsultant(consultant);
            const fullName = `${consultant.first_name} ${consultant.last_name}`;
            const location = [consultant.city, consultant.state, consultant.country]
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow
                key={consultant.id}
                className="border-border/30 hover:bg-secondary/30 transition-colors"
              >
                {/* Consultant Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {consultant.first_name[0]}{consultant.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fullName}</p>
                      {consultant.email && (
                        <p className="text-xs text-muted-foreground">{consultant.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {consultant.title || "N/A"}
                    </span>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {location || "Remote"}
                    </span>
                  </div>
                </TableCell>

                {/* Experience */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">
                      {consultant.experience ? `${consultant.experience} years` : "N/A"}
                    </span>
                  </div>
                </TableCell>

                {/* Skills */}
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {skills.slice(0, 3).map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-secondary/80 text-secondary-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {skills.length > 3 && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        +{skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Rate */}
                <TableCell>
                  <span className="text-sm font-medium text-primary">
                    {consultant.hourly_rate ? `$${consultant.hourly_rate}/hr` : "N/A"}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary hover:bg-primary/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {consultants.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No consultants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
