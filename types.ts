export interface Starter {
  id: string;
  name: string;
  role: string;
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string[]; // e.g., ["Safety", "Lab", "IT"]
}

export interface Module {
  id: string;
  name: string;
  duration: string; // e.g., "1 hour", "2 hours"
  requiredExpertise?: string; // Matches mentor expertise
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  starterName: string;
  mentorName: string;
  moduleName: string;
  location?: string;
}

export interface RosterGenerationParams {
  starters: Starter[];
  mentors: Mentor[];
  modules: Module[];
  startDate: string;
}
