import type { Meta, StoryObj } from '@storybook/nextjs';

const semanticTokens = [
  { name: 'background', className: 'bg-background text-foreground' },
  { name: 'foreground', className: 'bg-foreground text-background' },
  { name: 'primary', className: 'bg-primary text-primary-foreground' },
  { name: 'secondary', className: 'bg-secondary text-secondary-foreground' },
  { name: 'muted', className: 'bg-muted text-muted-foreground' },
  { name: 'accent', className: 'bg-accent text-accent-foreground' },
  { name: 'destructive', className: 'bg-destructive text-white' },
  { name: 'card', className: 'bg-card text-card-foreground border border-border' },
  { name: 'popover', className: 'bg-popover text-popover-foreground border border-border' },
  { name: 'border', className: 'bg-border text-foreground' },
  { name: 'input', className: 'bg-input text-foreground' },
  { name: 'ring', className: 'bg-ring text-foreground' },
] as const;

function ColorSwatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div className='space-y-2'>
      <div
        className={`flex h-16 items-end rounded-lg p-2 text-xs font-medium ${className}`}
      >
        {name}
      </div>
      <p className='font-mono text-xs text-muted-foreground'>--{name}</p>
    </div>
  );
}

function ThemeColorsShowcase() {
  return (
    <div className='w-full max-w-3xl space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold'>Semantic colors</h2>
        <p className='text-sm text-muted-foreground'>
          Values come from CSS variables in{' '}
          <code className='rounded bg-muted px-1 py-0.5'>src/app/globals.css</code>
          . Use the toolbar theme toggle to compare light and dark.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        {semanticTokens.map((token) => (
          <ColorSwatch key={token.name} name={token.name} className={token.className} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Design System/Theme Colors',
  component: ThemeColorsShowcase,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ThemeColorsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
