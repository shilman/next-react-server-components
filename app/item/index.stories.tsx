import type { Meta, StoryObj } from '@storybook/react';
import ItemNotFound from './not-found';

const meta = {
  title: 'app/Item',
  component: ItemNotFound,
} satisfies Meta<typeof ItemNotFound>;
export default meta;

type Story = StoryObj<typeof meta>;

export const NotFound: Story = {}