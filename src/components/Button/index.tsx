import styles from "./index.module.css";
type Props = {
  color: string;
  children?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  width?: string;
};

export const Button = ({
  children,
  disabled,
  onClick,
  color,
  width,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ background: color, width: width }}
      className={styles.buttonStyle}
    >
      {children}
    </button>
  );
};
