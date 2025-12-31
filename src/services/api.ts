export * from "./api";
export type * from "./api/types";

import { blogsApi } from "./api/blogs.service";
import { tagsApi } from "./api/tags.service";
import { projectsApi } from "./api/projects.service";
import { servicesApi } from "./api/services.service";
import { techStackApi } from "./api/tech-stack.service";
import { clientInformationApi } from "./api/client-information.service";

export const apiService = {
	// Blog methods
	getAllBlogs: blogsApi.getAllBlogs.bind(blogsApi),
	getBlogById: blogsApi.getBlogById.bind(blogsApi),
	getBlogBySlug: blogsApi.getBlogBySlug.bind(blogsApi),
	createBlog: blogsApi.createBlog.bind(blogsApi),
	updateBlog: blogsApi.updateBlog.bind(blogsApi),
	deleteBlog: blogsApi.deleteBlog.bind(blogsApi),

	// Tag methods
	getAllTags: tagsApi.getAllTags.bind(tagsApi),
	getTagById: tagsApi.getTagById.bind(tagsApi),
	createTag: tagsApi.createTag.bind(tagsApi),
	updateTag: tagsApi.updateTag.bind(tagsApi),
	deleteTag: tagsApi.deleteTag.bind(tagsApi),

	// Project methods
	getAllProjects: projectsApi.getAllProjects.bind(projectsApi),
	getProjectById: projectsApi.getProjectById.bind(projectsApi),
	createProject: projectsApi.createProject.bind(projectsApi),
	updateProject: projectsApi.updateProject.bind(projectsApi),
	deleteProject: projectsApi.deleteProject.bind(projectsApi),

	// Service methods
	getAllServices: servicesApi.getAllServices.bind(servicesApi),
	getServiceById: servicesApi.getServiceById.bind(servicesApi),
	createService: servicesApi.createService.bind(servicesApi),
	updateService: servicesApi.updateService.bind(servicesApi),
	deleteService: servicesApi.deleteService.bind(servicesApi),

	// Tech Stack methods
	getAllTechStacks: techStackApi.getAllTechStacks.bind(techStackApi),
	getTechStackById: techStackApi.getTechStackById.bind(techStackApi),
	createTechStack: techStackApi.createTechStack.bind(techStackApi),
	updateTechStack: techStackApi.updateTechStack.bind(techStackApi),
	deleteTechStack: techStackApi.deleteTechStack.bind(techStackApi),

	// Client Information methods
	getAllClientInformation:
		clientInformationApi.getAllClientInformation.bind(clientInformationApi),
	getClientInformationById:
		clientInformationApi.getClientInformationById.bind(clientInformationApi),
	createClientInformation:
		clientInformationApi.createClientInformation.bind(clientInformationApi),
	updateClientInformation:
		clientInformationApi.updateClientInformation.bind(clientInformationApi),
	deleteClientInformation:
		clientInformationApi.deleteClientInformation.bind(clientInformationApi),
};
