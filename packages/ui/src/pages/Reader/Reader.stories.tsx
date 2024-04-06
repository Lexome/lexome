import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Reader } from '.';

const ReaderMeta: ComponentMeta<typeof Reader> = {
  title: 'Reader',
  component: Reader,
};

export default ReaderMeta;

type ReaderStory = ComponentStory<typeof Reader>;

export const Basic: ReaderStory = () => <Reader />;
