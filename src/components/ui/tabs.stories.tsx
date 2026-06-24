import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='ko' className='w-full max-w-md'>
      <TabsList>
        <TabsTrigger value='ko'>한국어</TabsTrigger>
        <TabsTrigger value='en'>English</TabsTrigger>
        <TabsTrigger value='ja'>日本語</TabsTrigger>
      </TabsList>
      <TabsContent value='ko'>Admin 번역 탭 — 한국어 필드</TabsContent>
      <TabsContent value='en'>Admin translation tab — English fields</TabsContent>
      <TabsContent value='ja'>Admin translation tab — 日本語</TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue='overview' className='w-full max-w-md'>
      <TabsList variant='line'>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='tech'>Tech</TabsTrigger>
        <TabsTrigger value='links'>Links</TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>Project overview content</TabsContent>
      <TabsContent value='tech'>Technologies list</TabsContent>
      <TabsContent value='links'>Platform links</TabsContent>
    </Tabs>
  ),
};
