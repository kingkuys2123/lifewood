/**
 * Navigation configuration constants
 * Separated to allow fast refresh in Navbar component
 */
export const NAV_ITEMS = [
    { label: 'Home', to: '/' },
    {
        label: 'AI Initiatives',
        children: [
            { label: 'AI Projects', to: '/ai-initiatives/projects' },
            { label: 'AI Services', to: '/ai-initiatives/services' },
        ],
    },
    { label: 'Internal News', to: '/internal-news' },
    {
        label: 'Our Company',
        children: [
            { label: 'About Us', to: '/our-company/about' },
            { label: 'Offices', to: '/our-company/offices' },
        ],
    },
    { label: 'Philanthropy & Impact', to: '/philanthropy' },
    {
        label: 'What We Offer',
        children: [
            { label: 'Type A - Data Servicing', to: '/offer/type-a' },
            { label: 'Type B - Horizontal LLM Data', to: '/offer/type-b' },
            { label: 'Type C - Vertical LLM Data', to: '/offer/type-c' },
            { label: 'Type D - AIGC', to: '/offer/type-d' },
        ],
    },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact Us', to: '/contact' },
];

/**
 * Routes where the hero is white — navbar must always be solid
 */
export const ALWAYS_SOLID_PATHS = [
    '/privacy-policy',
    '/cookie-policy',
    '/terms-and-conditions',
    '/contact',
    '/apply',
    '/internal-news',
    '/philanthropy',
    '/careers',
    '/ai-initiatives',
    '/offer',
];

