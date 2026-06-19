import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight, Check, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const usageExamples = [
  {
    label: 'Active list title',
    className: 'text-lg font-bold text-primary',
    sample: 'Selected project',
  },
  {
    label: 'Category badge',
    className:
      'rounded px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary/10 text-primary',
    sample: 'WEB',
  },
  {
    label: 'Section label',
    className: 'text-xs font-black uppercase tracking-widest text-primary',
    sample: 'Story',
  },
] as const;

function BrandUsageShowcase() {
  return (
    <div className='w-full max-w-3xl space-y-10'>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold'>Brand color usage</h2>
        <p className='text-sm text-muted-foreground'>
          Semantic tokens live in{' '}
          <code className='rounded bg-muted px-1 py-0.5'>src/app/globals.css</code>
          .           Use <code className='rounded bg-muted px-1 py-0.5'>primary</code> for
          brand purple and <code className='rounded bg-muted px-1 py-0.5'>point</code>{' '}
          for highlight CTAs (green in light, yellow in dark). Avoid hard-coded{' '}
          <code className='rounded bg-muted px-1 py-0.5'>purple-*</code> /{' '}
          <code className='rounded bg-muted px-1 py-0.5'>yellow-*</code> /{' '}
          <code className='rounded bg-muted px-1 py-0.5'>green-*</code> classes.
        </p>
      </div>

      <section className='space-y-4'>
        <h3 className='text-sm font-semibold'>Color roles</h3>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-lg border border-border p-4 space-y-2'>
            <div className='flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium'>
              primary
            </div>
            <p className='text-sm text-muted-foreground'>
              Brand purple — selection, links, platform buttons, section labels.
            </p>
          </div>
          <div className='rounded-lg border border-border p-4 space-y-2'>
            <div className='flex h-10 items-center justify-center rounded-md bg-point text-point-foreground text-sm font-bold'>
              point
            </div>
            <p className='text-sm text-muted-foreground'>
              Highlight CTA — emerald green in light mode, warm yellow in dark
              (e.g. View story, selected list item). Use{' '}
              <code className='rounded bg-muted px-1 py-0.5'>text-point</code> or{' '}
              <code className='rounded bg-muted px-1 py-0.5'>bg-point</code>; values
              switch with the theme.
            </p>
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <h3 className='text-sm font-semibold'>Buttons</h3>
        <div className='flex flex-wrap gap-3'>
          <Button variant='default'>Primary CTA</Button>
          <Button variant='soft'>Soft</Button>
          <Button variant='point' className='rounded-full'>
            <span className='relative inline-flex size-4 items-center justify-center'>
              <Lightbulb size={16} strokeWidth={2.25} />
            </span>
            View story
            <ArrowRight size={16} aria-hidden />
          </Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='secondary'>Secondary</Button>
        </div>
        <ul className='list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
          <li>
            <code>variant=&quot;default&quot;</code> — solid brand actions (
            <code>bg-primary</code>)
          </li>
          <li>
            <code>variant=&quot;soft&quot;</code> — low-emphasis brand (
            <code>bg-primary/10 text-primary</code>)
          </li>
          <li>
            <code>variant=&quot;point&quot;</code> — highlight CTA (
            <code>bg-point text-point-foreground</code>)
          </li>
        </ul>
      </section>

      <section className='space-y-4'>
        <h3 className='text-sm font-semibold'>Text &amp; badges</h3>
        <div className='space-y-3 rounded-lg border border-border p-4'>
          {usageExamples.map((example) => (
            <div key={example.label} className='flex items-center gap-3'>
              <span className={example.className}>{example.sample}</span>
              <code className='text-xs text-muted-foreground'>{example.className}</code>
            </div>
          ))}
          <div className='flex items-center gap-2'>
            <Check className='size-4 text-primary' aria-hidden />
            <span className='text-sm text-muted-foreground'>
              Selection icon — <code>text-primary</code>
            </span>
          </div>
        </div>
      </section>

      <section className='space-y-3'>
        <h3 className='text-sm font-semibold'>Token reference</h3>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='space-y-1'>
            <div className='flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-medium'>
              primary
            </div>
            <p className='font-mono text-xs text-muted-foreground'>bg-primary</p>
          </div>
          <div className='space-y-1'>
            <div className='flex h-12 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-medium'>
              primary/10
            </div>
            <p className='font-mono text-xs text-muted-foreground'>soft surfaces</p>
          </div>
          <div className='space-y-1'>
            <div className='flex h-12 items-center justify-center rounded-lg bg-point text-point-foreground text-xs font-bold'>
              point
            </div>
            <p className='font-mono text-xs text-muted-foreground'>bg-point</p>
          </div>
          <div className='space-y-1'>
            <div className='flex h-12 items-center justify-center rounded-lg text-primary text-sm font-bold'>
              Aa
            </div>
            <p className='font-mono text-xs text-muted-foreground'>text-primary</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: 'Design System/Brand Usage',
  component: BrandUsageShowcase,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BrandUsageShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
