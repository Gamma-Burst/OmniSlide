import { create } from 'zustand';
import { Project, Slide, ContentBlock, User } from './types';

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  currentUser: User | null;
  isLoading: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setCurrentProject: (id: string) => void;
  updateSlide: (projectId: string, slideId: string, updates: Partial<Slide>) => void;
  updateBlock: (projectId: string, slideId: string, blockId: string, content: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProjectId: null,
  currentUser: { uid: 'demo-user', email: 'demo@omni.slide', isPro: true, name: 'Demo User' },
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects],
    currentProjectId: project.id 
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  setCurrentProject: (id) => set({ currentProjectId: id }),

  updateSlide: (projectId, slideId, updates) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        slides: p.slides.map(s => s.id === slideId ? { ...s, ...updates } : s)
      };
    })
  })),

  updateBlock: (projectId, slideId, blockId, content) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        slides: p.slides.map(s => {
          if (s.id !== slideId) return s;
          return {
            ...s,
            blocks: s.blocks.map(b => b.id === blockId ? { ...b, content } : b)
          };
        })
      };
    })
  })),
}));