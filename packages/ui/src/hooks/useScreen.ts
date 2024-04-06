import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export enum Screen {
  SM,
  MS,
  MD,
  LG,
  XL,
  '2XL'
}

const getScreen = (width: number): Screen => {
  if (width >= 1536) return Screen['2XL'];
  if (width >= 1280) return Screen.XL;
  if (width >= 1024) return Screen.LG;
  if (width >= 860) return Screen.MD;
  if (width >= 768) return Screen.MS;
  return Screen.SM;
};

export default function useScreen(): Screen {
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState(getScreen(width));

  useEffect(() => setScreen(getScreen(width)), [width]);

  return screen;
}
