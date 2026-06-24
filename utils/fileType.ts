// File-type glyph metadata (brand color + short label) for document icons.
export interface FileTypeGlyph {
    color: string;
}

export const FILE_TYPE_GLYPH: Record<string, FileTypeGlyph> = {
    pdf: { color: '#e5392f' },
    docx: { color: '#2b579a' },
    doc: { color: '#2b579a' },
    txt: { color: '#5b6470' },
};

export const DEFAULT_FILE_GLYPH: FileTypeGlyph = { color: '#6b7280' };

// Resolve a short file-type key (pdf/docx/txt/doc) from an explicit fileType,
// else from the title's extension.
export const fileTypeKey = (doc: { fileType?: string; title?: string }): string => {
    if (doc.fileType) return doc.fileType.toLowerCase();
    const ext = doc.title?.split('.').pop()?.toLowerCase();
    return ext && ext.length <= 4 ? ext : 'doc';
};
