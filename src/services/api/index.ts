// Export all API services
export { blogsApi } from "./blogs.service";
export { tagsApi } from "./tags.service";
export { projectsApi } from "./projects.service";
export { servicesApi } from "./services.service";
export { techStackApi } from "./tech-stack.service";
export { clientInformationApi } from "./client-information.service";

// Export types
export type { ApiResponse } from "./client";
export type {
  // Blog types
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  // Tag types
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  // Project types
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  // Service types
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  // Tech Stack types
  TechStack,
  CreateTechStackRequest,
  UpdateTechStackRequest,
  // Client Information types
  ClientInformation,
  CreateClientInformationRequest,
  UpdateClientInformationRequest,
} from "./types";

// Convenience export for accessing all APIs through a single object
import { blogsApi } from "./blogs.service";
import { tagsApi } from "./tags.service";
import { projectsApi } from "./projects.service";
import { servicesApi } from "./services.service";
import { techStackApi } from "./tech-stack.service";
import { clientInformationApi } from "./client-information.service";

export const api = {
  blogs: blogsApi,
  tags: tagsApi,
  projects: projectsApi,
  services: servicesApi,
  techStack: techStackApi,
  clientInformation: clientInformationApi,
};
