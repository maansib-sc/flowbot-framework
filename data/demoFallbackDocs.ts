// TODO(demo-seed): TEMPORARY. Remove this file once the backend seeds the
// `demo-library` namespace. Until then, when GET /public/namespaces/demo-library/documents
//  returns [], these stand-ins let the demo UI render. They have placeholder
//  result_graph_ids, so queries won't return real answers until the backend is seeded.
import { PublicDocument } from '@/types/namespace';

export const DEMO_FALLBACK_DOCS: PublicDocument[] = [
    {
        id: 'demo-fallback-api-guide',
        namespace: 'demo-library',
        title: 'API Integration Guide',
        description: 'Authenticate, make requests, and handle responses with the platform API.',
        fileType: 'pdf',
        pageCount: 28,
        suggested_queries: [
            'How do I authenticate with the API?',
            'What are the rate limits?',
            'Show me an example request and response.',
        ],
        result_graph_id: 'demo-fallback-api-guide',
        state: 'COMPLETED',
    },
    {
        id: 'demo-fallback-product-overview',
        namespace: 'demo-library',
        title: 'Product Overview',
        description: 'A high-level tour of the product, core features, and common use cases.',
        fileType: 'docx',
        pageCount: 18,
        suggested_queries: [
            'What can this product do?',
            'Who is it for?',
            'What are the main features?',
        ],
        result_graph_id: 'demo-fallback-product-overview',
        state: 'COMPLETED',
    },
    {
        id: 'demo-fallback-getting-started',
        namespace: 'demo-library',
        title: 'Getting Started',
        description: 'Step-by-step setup to go from zero to your first working example.',
        fileType: 'txt',
        pageCount: 9,
        suggested_queries: [
            'How do I get started?',
            'What are the prerequisites?',
            'How do I set up my first project?',
        ],
        result_graph_id: 'demo-fallback-getting-started',
        state: 'COMPLETED',
    },
];
