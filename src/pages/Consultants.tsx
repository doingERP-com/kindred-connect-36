import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useConsultants, getSkillsFromConsultant } from "@/hooks/useConsultants";
import { ConsultantFilters } from "@/components/consultants/ConsultantFilters";
import { ConsultantTable } from "@/components/consultants/ConsultantTable";
import { Loader2, Users } from "lucide-react";

const Consultants = () => {
  const { data: consultants, isLoading, error } = useConsultants();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    if (!consultants) return [];
    const cats = consultants
      .map((c) => c.project_category)
      .filter((c): c is string => !!c);
    return [...new Set(cats)];
  }, [consultants]);

  // Filter consultants
  const filteredConsultants = useMemo(() => {
    if (!consultants) return [];

    return consultants.filter((consultant) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${consultant.first_name} ${consultant.last_name}`.toLowerCase();
      const skills = getSkillsFromConsultant(consultant).join(" ").toLowerCase();
      const title = consultant.title?.toLowerCase() || "";
      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchLower) ||
        title.includes(searchLower) ||
        skills.includes(searchLower);

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || consultant.project_category === categoryFilter;

      // Experience filter
      let matchesExperience = true;
      if (experienceFilter !== "all" && consultant.experience !== null) {
        const exp = consultant.experience;
        if (experienceFilter === "0-5") matchesExperience = exp >= 0 && exp <= 5;
        else if (experienceFilter === "5-10") matchesExperience = exp > 5 && exp <= 10;
        else if (experienceFilter === "10+") matchesExperience = exp > 10;
      }

      return matchesSearch && matchesCategory && matchesExperience;
    });
  }, [consultants, searchTerm, categoryFilter, experienceFilter]);

  return (
    <>
      <Helmet>
        <title>Our Consultants - DOINGERP | Expert Oracle Cloud HCM Team</title>
        <meta
          name="description"
          content="Meet our team of certified Oracle Cloud HCM consultants with decades of combined experience in enterprise implementations."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Users size={16} />
                  Expert Team
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-up">
                  Our <span className="gradient-text">Consultants</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Meet our team of certified Oracle Cloud HCM experts ready to transform your enterprise operations.
                </p>
              </div>
            </div>
          </section>

          {/* Consultants Section */}
          <section className="pb-20 lg:pb-32">
            <div className="container mx-auto px-4">
              {/* Filters */}
              <ConsultantFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                experienceFilter={experienceFilter}
                onExperienceChange={setExperienceFilter}
                categories={categories}
              />

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="text-primary font-medium">
                    {filteredConsultants.length}
                  </span>{" "}
                  consultant{filteredConsultants.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="glass-card p-12 text-center rounded-2xl">
                  <p className="text-destructive">Error loading consultants. Please try again later.</p>
                </div>
              ) : (
                <ConsultantTable consultants={filteredConsultants} />
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Consultants;
