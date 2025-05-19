// This file contains configuration for the admin pages

// Set dynamic to force-dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// Skip prerendering for admin pages
export const generateStaticParams = () => {
  return []
}
