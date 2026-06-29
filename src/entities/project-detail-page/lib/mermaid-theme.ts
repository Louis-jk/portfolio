import type { MermaidConfig } from 'mermaid';

export function getMermaidRenderConfig(isDark: boolean): MermaidConfig {
  if (!isDark) {
    return {
      startOnLoad: false,
      theme: 'neutral',
    };
  }

  return {
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: '#0f172a',
      primaryColor: '#334155',
      primaryTextColor: '#f1f5f9',
      primaryBorderColor: '#64748b',
      secondaryColor: '#1e293b',
      secondaryTextColor: '#e2e8f0',
      secondaryBorderColor: '#64748b',
      tertiaryColor: '#475569',
      tertiaryTextColor: '#e2e8f0',
      tertiaryBorderColor: '#64748b',
      lineColor: '#94a3b8',
      textColor: '#f1f5f9',
      mainBkg: '#1e293b',
      nodeBorder: '#64748b',
      clusterBkg: '#334155',
      clusterBorder: '#64748b',
      titleColor: '#f8fafc',
      edgeLabelBackground: '#1e293b',
      actorTextColor: '#f8fafc',
      actorLineColor: '#94a3b8',
      actorBkg: '#334155',
      signalColor: '#cbd5e1',
      signalTextColor: '#f8fafc',
      labelBoxBkgColor: '#334155',
      labelBoxBorderColor: '#64748b',
      labelTextColor: '#f8fafc',
      loopTextColor: '#e2e8f0',
      noteBorderColor: '#64748b',
      noteBkgColor: '#475569',
      noteTextColor: '#f8fafc',
      activationBorderColor: '#64748b',
      activationBkgColor: '#475569',
      sequenceNumberColor: '#f8fafc',
    },
  };
};
