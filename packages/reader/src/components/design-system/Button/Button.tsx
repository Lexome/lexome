import { styled, Button } from "@style-kit-n/web"
import { COLORS } from "../../../theme/colors.stylex"
import { Row } from "../Row"

const buttonStyles = styled(Button, {
  textButton: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
  },
  filledButton: {
    backgroundColor: COLORS.primary,
    color: 'white',
  },
  button: {
    backgroundColor: COLORS.primary,
    color: 'white',
    borderRadius: '4px',
    border: 'none',
    ':hover': {
      transform: 'scale(1.04)',
    },
    padding: '8px',
  }
})

export enum BUTTON_TYPE {
  TEXT = 'text',
  FILLED = 'filled',
}

// export const Button: React.FC<{
//   styles?: StyleXStyles[],
//   onClick: () => void,
//   label: string,
//   type?: BUTTON_TYPE
//   icon?: React.FC<any>,
//   leftIcon?: React.FC<any>,
//   rightIcon?: React.FC<any>,
// }> = ({
//   styles,
//   onClick,
//   label,
//   icon,
//   leftIcon,
//   rightIcon,
//   type=BUTTON_TYPE.FILLED
// }) => {
//   const LeftIcon = leftIcon
//   const RightIcon = rightIcon
//   const passedStyles = styles || []
//   return (
//     <button
//       {...stylex.props(
//         buttonStyles.button,
//         type === BUTTON_TYPE.TEXT && buttonStyles.textButton,
//         type === BUTTON_TYPE.FILLED && buttonStyles.filledButton,
//         ...passedStyles
//       )}
//       style={{
//         paddingLeft: leftIcon ? '8px' : '16px',
//         paddingRight: rightIcon ? '8px' : '16px'
//       }}
//       onClick={() => {
//         onClick()
//         console.log('Button clicked')
//       }}
//       aria-label={label}
//     >
//       <Row>
//         {LeftIcon &&
//           <Row mr={2}>
//             <LeftIcon />
//           </Row>
//         }
//         {label}
//         {RightIcon && 
//           <Row ml={2}>
//             <RightIcon />
//           </Row>
//         }
//       </Row>
//     </button>
//   )
// }