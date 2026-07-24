import {defineEcConfig} from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-dark-default'],
  useDarkModeMediaQuery: false,
  minSyntaxHighlightingColorContrast: 5.5,
  useThemedScrollbars: false,
  useThemedSelectionColors: false,
  frames: {
    extractFileNameFromCode: false,
    showCopyToClipboardButton: true,
    removeCommentsWhenCopyingTerminalFrames: false,
  },
  customizeTheme(theme) {
    theme.colors['editor.background'] = '#05080e';
    theme.colors['editor.foreground'] = '#c8d4e5';
    theme.colors['editor.selectionBackground'] = '#213751';
    theme.colors['editorGroupHeader.tabsBackground'] = '#142238';
    theme.colors['tab.activeBackground'] = '#142238';
    theme.colors['tab.activeForeground'] = '#f7fbff';
    theme.colors['titleBar.activeBackground'] = '#142238';
    theme.colors['titleBar.activeForeground'] = '#f7fbff';
    theme.colors['titleBar.border'] = '#3e526b';
    theme.colors.focusBorder = '#85c241';
    theme.colors['terminal.background'] = '#05080e';
    theme.colors['terminal.foreground'] = '#c8d4e5';
    theme.colors['terminal.ansiGreen'] = '#85c241';
  },
  styleOverrides: {
    borderRadius: 'var(--xp-radius-md)',
    borderWidth: '1px',
    codeFontFamily: 'var(--xp-font-mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    codePaddingBlock: '1.125rem',
    codePaddingInline: '1.25rem',
    uiFontFamily: 'var(--xp-font-sans)',
    uiFontSize: '0.8125rem',
    focusBorder: 'var(--xp-focus-ring)',
    frames: {
      frameBoxShadowCssValue: 'var(--xp-shadow-sm)',
      terminalTitlebarDotsOpacity: '0',
      terminalTitlebarBackground: 'var(--xp-surface-2)',
      terminalTitlebarForeground: 'var(--xp-text-secondary)',
      terminalTitlebarBorderBottomColor: 'var(--xp-border-muted)',
      inlineButtonForeground: 'var(--xp-text-primary)',
      inlineButtonBorder: 'var(--xp-border-strong)',
      inlineButtonBackground: 'var(--xp-surface-3)',
      inlineButtonBackgroundIdleOpacity: '0.72',
      inlineButtonBackgroundHoverOrFocusOpacity: '1',
      inlineButtonBackgroundActiveOpacity: '0.86',
      tooltipSuccessBackground: 'var(--xp-accent-primary-active)',
      tooltipSuccessForeground: 'var(--xp-accent-primary-text)',
    },
    textMarkers: {
      markHue: '205',
      insHue: '118',
      defaultChroma: '30',
      backgroundOpacity: '30%',
      borderOpacity: '78%',
      lineMarkerAccentWidth: '0.2rem',
    },
  },
});
