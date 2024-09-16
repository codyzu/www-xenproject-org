import type { Meta, StoryObj } from "@storybook/react";
import MarginGallery from "./MarginGallery";

const meta: Meta = {
  title: "Components/MarginGallery",
  component: MarginGallery,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    children: "Text",
  },
};

export const OtherExample: Story = {
  name: "Custom name 2",
  args: {
    children: "Text",
  },
};
