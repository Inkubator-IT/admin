// Blog Types
export type ContentBlockType = "paragraph" | "header" | "quote";

export interface ContentBlock {
  type: ContentBlockType;
  text: string;
}

export interface Blog {
  id: number;
  title: string;
  author: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  content: ContentBlock[];
  time_read: string;
  tag_id: number;
  tag?: {
    tag_id: number;
    tag_name: string;
    tag_description: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBlogRequest {
  title: string;
  author: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  content: ContentBlock[];
  time_read: string;
  tag_id: number;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {}

// Tag Types
export interface Tag {
  tag_id: number;
  tag_name: string;
  tag_description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagRequest {
  tag_name: string;
  tag_description: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}

// Project Types
export interface Project {
  id: number;
  title: string;
  description: string;
  owner: string;
  url: string;
  tag_id: number;
  tech_stack_id: number;
  testimonial: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  owner: string;
  url: string;
  tag_id: number;
  tech_stack_id: number;
  testimonial: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

// Service Types
export interface Service {
  service_id: number;
  service_name: string;
  service_description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequest {
  service_name: string;
  service_description: string;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

// Tech Stack Types
export interface TechStack {
  tech_stack_id: number;
  tech_stack_name: string;
  tech_stack_description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTechStackRequest {
  tech_stack_name: string;
  tech_stack_description: string;
}

export interface UpdateTechStackRequest extends Partial<CreateTechStackRequest> {}

// Client Information Types
export interface ClientInformation {
  id: number;
  nama_lengkap: string;
  email: string;
  no_whatsapp: string;
  instansi: string;
  civitas_itb: boolean;
  jenis_proyek: string;
  tujuan_pembuatan_proyek: string;
  deskripsi_proyek: string;
  ekspetasi_biaya: string;
  deadline_proyek: string;
  sudah_memiliki_desain: boolean;
  pertanyaan_untuk_proyek: string;
  dimana_mengetahui_iit: string;
  rating_website: number;
  masukan_website: string;
  kode_promo: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientInformationRequest {
  nama_lengkap: string;
  email: string;
  no_whatsapp: string;
  instansi: string;
  civitas_itb: boolean;
  jenis_proyek: string;
  tujuan_pembuatan_proyek: string;
  deskripsi_proyek: string;
  ekspetasi_biaya: string;
  deadline_proyek: string;
  sudah_memiliki_desain: boolean;
  pertanyaan_untuk_proyek: string;
  dimana_mengetahui_iit: string;
  rating_website: number;
  masukan_website: string;
  kode_promo: string;
}

export interface UpdateClientInformationRequest extends Partial<CreateClientInformationRequest> {}
