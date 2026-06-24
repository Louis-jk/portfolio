import type { Meta, StoryObj } from '@storybook/nextjs';
import ThemeToggle from '@/components/theme/ThemeToggle';

const meta = {
  title: 'Portfolio/Theme Toggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Header theme switcher. Uses `next-themes` — sync with the Storybook toolbar Theme control.',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
