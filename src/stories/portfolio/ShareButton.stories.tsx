import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import ShareButton from '@/components/button/share/ShareButton';

const meta = {
  title: 'Portfolio/Share Button',
  component: ShareButton,
  tags: ['autodocs'],
  args: {
    onShareClick: fn(),
  },
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
