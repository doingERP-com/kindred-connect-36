-- Create consultants table
CREATE TABLE public.consultants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    title TEXT,
    profile_summary TEXT,
    experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    rating INTEGER DEFAULT 0,
    project_category TEXT,
    can_relocate BOOLEAN DEFAULT false,
    skill_1 TEXT,
    skill_2 TEXT,
    skill_3 TEXT,
    skill_4 TEXT,
    skill_5 TEXT,
    skill_6 TEXT,
    skill_7 TEXT,
    skill_8 TEXT,
    skill_9 TEXT,
    skill_10 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (consultants are public info)
CREATE POLICY "Anyone can view consultants" 
ON public.consultants 
FOR SELECT 
USING (true);

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_consultants_updated_at
BEFORE UPDATE ON public.consultants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();