// Re-using existing visual types
export interface ColorScheme {
  primary: string;
  primaryHover: string;
  secondary: string;
  surface: string;
  surfaceHighlight: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ComponentSpecs {
  buttons: {
    primary: { background: string; text: string; hover: string; radius: string };
    secondary: { border: string; text: string; hoverBackground: string; radius: string };
  };
  cards: {
    background: string;
    radius: string;
    shadow: string;
    hoverShadow: string;
  };
  inputs: {
    background: string;
    border: string;
    focusBorder: string;
    radius: string;
  };
  badges: {
    success: { background: string; text: string };
    error: { background: string; text: string };
    warning: { background: string; text: string };
    info: { background: string; text: string };
  };
}

export interface DesignSystem {
  theme: string;
  projectName?: string;
  description: string;
  uiImage?: string; // Generated on the fly
  colors: {
    light: ColorScheme;
    dark: ColorScheme;
  };
  gradients: {
    primary: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    scale: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      caption: string;
    };
  };
  spacing: {
    base: number;
    scale: { xs: string; sm: string; md: string; lg: string; xl: string; xxl: string };
  };
  animation: {
    duration: { fast: string; normal: string; slow: string };
    easing: string;
  };
  components: ComponentSpecs;
  iconStyle: string;
  borderRadius: { small: string; medium: string; large: string; full: string };
  shadows: { sm: string; md: string; lg: string };
}

// --- NEW FRACTAL MANIFEST TYPES ---

export interface ProjectInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  version: string;
  domain: string;
}

export interface TechStack {
  stackPreset: string;
  persistence: { mode: string; options: any };
  quality: { unitTests: boolean; e2eTests: boolean; ci_cd: string };
}

export interface SeoConfig {
  enabled: boolean;
  indexing: { robotsTxt: string; sitemap: boolean };
  metadata: { type: string; title: string };
}

export interface GrowthStrategy {
  enabled: boolean;
  viralLoop: { mechanism: string; reward: string };
  onboarding: { gamified: boolean; steps: { id: string; label: string; reward: string }[] };
}

export interface LandingSection {
  id: string;
  type: string;
  content: any; // Flexible content based on section type
}

export interface LandingPage {
  structure: string[];
  sections: Record<string, any>;
}

export interface AuthConfig {
  enabled: boolean;
  modes: string[];
  providers: string[];
}

export interface AppStructure {
  layout: string;
  dashboard: {
    name: string;
    modules: { id: string; label: string; icon: string }[];
  };
}

// THE MASTER MANIFEST
export interface ProjectManifest {
  specVersion: string;
  auditStatus: string;
  branding: string;
  comment: string;
  
  project: ProjectInfo;
  tech: TechStack;
  seo: SeoConfig;
  growth: GrowthStrategy;
  designSystem: DesignSystem; // Nested Design System
  landing: LandingPage;
  auth: AuthConfig;
  app: AppStructure;
}

export const INITIAL_DESIGN_SYSTEM: DesignSystem = {
  theme: "light",
  projectName: "Initial State",
  description: "Initial State",
  colors: {
    light: {
      primary: "#000", primaryHover: "#333", secondary: "#666", surface: "#fff", surfaceHighlight: "#f5f5f5", background: "#fff", text: "#000", textSecondary: "#666", border: "#eee", success: "green", warning: "orange", error: "red", info: "blue"
    },
    dark: {
      primary: "#fff", primaryHover: "#ccc", secondary: "#999", surface: "#000", surfaceHighlight: "#111", background: "#000", text: "#fff", textSecondary: "#aaa", border: "#333", success: "lightgreen", warning: "yellow", error: "pink", info: "lightblue"
    }
  },
  gradients: { primary: "", secondary: "" },
  typography: { fontFamily: "Inter", scale: { h1: "32px", h2: "24px", h3: "20px", body: "16px", caption: "12px" } },
  spacing: { base: 4, scale: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px" } },
  animation: { duration: { fast: "150ms", normal: "300ms", slow: "500ms" }, easing: "ease" },
  components: {
    buttons: { primary: { background: "#000", text: "#fff", hover: "#333", radius: "4px" }, secondary: { border: "#000", text: "#000", hoverBackground: "#eee", radius: "4px" } },
    cards: { background: "#fff", radius: "8px", shadow: "none", hoverShadow: "sm" },
    inputs: { background: "#fff", border: "#ccc", focusBorder: "#000", radius: "4px" },
    badges: { success: { background: "green", text: "white" }, error: { background: "red", text: "white" }, warning: { background: "orange", text: "white" }, info: { background: "blue", text: "white" } }
  },
  iconStyle: "outline",
  borderRadius: { small: "2px", medium: "4px", large: "8px", full: "99px" },
  shadows: { sm: "0 1px 2px rgba(0,0,0,0.1)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)" }
};