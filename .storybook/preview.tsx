import type { Preview } from '@storybook/nextjs';
import { withThemeByClassName } from '@storybook/addon-themes';
import { StorybookProviders } from './preview-providers';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: ['Introduction', 'Design System', 'UI', 'Portfolio', '*'],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <StorybookProviders>
        <div className='min-w-[20rem] bg-background p-6 font-sans text-foreground'>
          <Story />
        </div>
      </StorybookProviders>
    ),
  ],
};

export default preview;
