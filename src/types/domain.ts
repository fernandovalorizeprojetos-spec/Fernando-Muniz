export const dashboardSectionTypes = [
  'Visão Geral',
  'Métricas',
  'Gráficos',
  'Cronograma',
  'Equipe',
  'Formação',
  'Acessibilidade',
  'Decisões',
  'Galeria',
] as const;

export type DashboardSectionType = (typeof dashboardSectionTypes)[number];
export type AppRole = 'admin' | 'client_editor' | 'client_viewer';
export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed' | 'archived';
export type MembershipRole = Exclude<AppRole, 'admin'>;

export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startsOn: string | null;
  endsOn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  id: string;
  projectId: string;
  templateId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSection {
  id: string;
  dashboardId: string;
  type: DashboardSectionType;
  position: number;
  isEnabled: boolean;
  configuration: Record<string, unknown>;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: MembershipRole;
  createdAt: string;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}
