import type { Meta, StoryObj } from '@storybook/nextjs';

const typeSamples = [
  { label: 'Page title', className: 'text-3xl font-black tracking-tighter' },
  { label: 'Section heading', className: 'text-lg font-semibold' },
  { label: 'Body', className: 'text-sm leading-normal text-foreground' },
  { label: 'Muted helper', className: 'text-sm text-muted-foreground' },
  { label: 'Label / badge', className: 'text-xs font-black uppercase tracking-widest text-purple-600' },
  { label: 'Mono token', className: 'font-mono text-xs text-muted-foreground' },
] as const;

function TypographyShowcase() {
  return (
    <div className='w-full max-w-2xl space-y-8'>
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold'>Typography</h2>
        <p className='text-sm text-muted-foreground'>
          Common text styles used across the portfolio and admin UI. Font stacks
          are defined in <code className='rounded bg-muted px-1'>globals.css</code>{' '}
          and <code className='rounded bg-muted px-1'>tailwind.config.ts</code>.
        </p>
      </div>
      <div className='space-y-6'>
        {typeSamples.map((sample) => (
          <div key={sample.label} className='space-y-1 border-b border-border pb-4'>
            <p className={sample.className}>{sample.label}</p>
            <p className='font-mono text-xs text-muted-foreground'>{sample.className}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Design System/Typography',
  component: TypographyShowcase,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
