import { styled } from "@/theme"


type IconButtonProps = {
  icon: React.ReactNode,
  onClick: () => void
}

const IconButtonElement = styled("button", {
  styles: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    margin: 0,
  }
})

export const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return <IconButtonElement onClick={onClick}>{icon}</IconButtonElement>
}
