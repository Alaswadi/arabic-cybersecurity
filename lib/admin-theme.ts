// Admin Panel Theme Configuration

export const adminTheme = {
  colors: {
    // Primary colors
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      lighter: '#EEF2FF',
      dark: '#4338CA',
    },
    
    // Neutral colors
    text: {
      primary: '#4B5563',
      secondary: '#6B7280',
      muted: '#9CA3AF',
    },
    
    background: {
      main: '#F9FAFB',
      card: '#FFFFFF',
      sidebar: '#F3F4F6',
      hover: '#F3F4F6',
      selected: '#EEF2FF',
    },
    
    border: {
      light: '#E5E7EB',
      main: '#D1D5DB',
      dark: '#9CA3AF',
    },
    
    // Status colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  typography: {
    fontFamily: 'Cairo, sans-serif',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

// Helper functions to use the theme
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let result: any = adminTheme.colors;
  
  for (const key of keys) {
    if (result[key] === undefined) {
      console.warn(`Color path "${path}" not found in theme`);
      return '#000000';
    }
    result = result[key];
  }
  
  return result;
};

export const getShadow = (size: 'sm' | 'md' | 'lg'): string => {
  return adminTheme.shadows[size] || adminTheme.shadows.sm;
};

export const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): string => {
  return adminTheme.spacing[size] || adminTheme.spacing.md;
};

export const getBorderRadius = (size: 'sm' | 'md' | 'lg' | 'xl' | 'full'): string => {
  return adminTheme.borderRadius[size] || adminTheme.borderRadius.md;
};

export const getFontSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'): string => {
  return adminTheme.typography.fontSizes[size] || adminTheme.typography.fontSizes.md;
};

export const getFontWeight = (weight: 'normal' | 'medium' | 'semibold' | 'bold'): number => {
  return adminTheme.typography.fontWeights[weight] || adminTheme.typography.fontWeights.normal;
};
