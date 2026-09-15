// Aggregated content bundle. Every feature reads content through this module.
import type { ContentBundle } from "@/types";
import { tracks } from "./tracks";
import { skills } from "./skills";
import { resources } from "./resources";
import { projects } from "./projects";
import { drills } from "./drills";
import { assessments } from "./assessments";
import { paths } from "./paths";
import { milestones } from "./milestones";
import { cards } from "./cards";
import { tags } from "./tags";
import { strategy } from "./strategy";

export const content: ContentBundle = {
  tracks, skills, resources, projects, drills, assessments, paths, milestones, cards, tags, strategy,
  meta: {
    generated: "2026-09-15",
    version: "1.0.0",
    sourceDocs: [
      "Personal Learning Platform Spec & Curriculum — Product-CTO Track (Sept 2026)",
      "From Cyber Generalist to Founder: A 5-Year Plan (2026–2031)",
    ],
  },
};

export { tracks, skills, resources, projects, drills, assessments, paths, milestones, cards, tags, strategy };
