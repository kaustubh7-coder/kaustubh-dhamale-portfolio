import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject too long")
    .trim(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message too long")
    .trim(),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .trim(),
  description: z.string().min(1).max(1000).trim(),
  longDescription: z.string().max(5000).optional().nullable(),
  image: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  liveUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  category: z.string().min(1).max(100).trim(),
  icon: z.string().max(100).optional().nullable(),
  proficiency: z.number().int().min(0).max(100).default(80),
  sortOrder: z.number().int().default(0),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
