import { styled } from "@/theme";
import { COLOR } from "@/theme/colors";
import { Column } from "./Column";
import { Row } from "./Row";
import { CSSProperties, PropsWithChildren } from "react";

export enum CARD_LAYOUT {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

type CardContainerProps = {
  layout?: CARD_LAYOUT,
  clickable?: boolean
}

export const CardContainer = styled<CardContainerProps>(
  'div',
  ({
    layout = CARD_LAYOUT.VERTICAL,
    clickable = false
  }: CardContainerProps) => ({
    bg: COLOR.BACKGROUND_STRONG,
    border: '1px solid',
    borderColor: COLOR.FOREGROUND_SOFT,
    styles: {
      display: 'flex',
      flexDirection: layout === CARD_LAYOUT.VERTICAL ? 'column' : 'row',
      boxShadow: '0 0 16px 0 rgba(0,0,0,0.1)',
      borderRadius: '8px',
    },
    hover: {
      styles: {
        transform: 'scale(1.02)',
        cursor: clickable ? 'pointer' : 'default'
      }
    }
  })
)

export enum CARD_IMAGE_FIT {
  COVER = 'cover',
  CONTAIN = 'contain'
}

type CardProps = {
  layout?: CARD_LAYOUT,
  onClick?: () => void,
  imageUri?: string,
  imageHeight?: string,
  imageWidth?: string,
  imageFit?: CARD_IMAGE_FIT,
  style?: CSSProperties
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  onClick,
  layout = CARD_LAYOUT.VERTICAL,
  imageUri,
  imageHeight,
  imageWidth,
  imageFit = CARD_IMAGE_FIT.COVER,
  style,
  children
}) => {
  return (
    <CardContainer layout={layout} clickable style={style}>
      { imageUri && (
        <Column
          style={{
            alignItems: 'center',
          }}
        >
          <img
            src={imageUri}
            style={{
              // objectFit: imageFit === CARD_IMAGE_FIT.COVER ? 'cover' : 'contain',
              width: imageWidth,
              height: imageHeight,
              borderRadius: '8px',
            }}
          />
        </Column>
      )}
      <Column>
        {children}
      </Column>
    </CardContainer>
  )
}
