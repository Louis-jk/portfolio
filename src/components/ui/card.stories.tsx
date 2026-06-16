import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Project title</CardTitle>
        <CardDescription>Short summary shown in admin or list views.</CardDescription>
        <CardAction>
          <Button size='sm' variant='outline'>
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Card body — forms, metadata, or preview content.</p>
      </CardContent>
      <CardFooter className='gap-2'>
        <Button size='sm'>Save</Button>
        <Button size='sm' variant='ghost'>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size='sm' className='w-full max-w-xs'>
      <CardHeader>
        <CardTitle>Compact</CardTitle>
        <CardDescription>size=&quot;sm&quot;</CardDescription>
      </CardHeader>
    </Card>
  ),
};
