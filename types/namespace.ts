export type NamespaceMode = 'private' | 'public';

export interface PublicDocument {
  id: string;
  namespace?: string;
  title?: string;
  description?: string;
  suggested_queries: string[];
  result_graph_id?: string;
  fileType?: string; 
  pageCount?: number; 
  state: string;
}

export interface NamespaceState {
  mode: NamespaceMode;
  hasPrivateDocs: boolean;
  publicDocs: PublicDocument[];
  activeDocId: string | null;
  activeDoc: PublicDocument | null;
  setActiveDoc: (id: string) => void;
  demoActivated: boolean;
  activateDemo: () => void;
}
