import type { Meta, StoryObj } from '@storybook/nextjs';
import { Plus } from 'lucide-react';
import { Button } from './button';

const variants = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
] as const;

const sizes = ['xs', 'sm', 'default', 'lg'] as const;

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    size: {
      control: 'select',
      options: [...sizes, 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Learn more' },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus data-icon='inline-start' />
        New project
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    'aria-label': 'Add',
    children: <Plus />,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
