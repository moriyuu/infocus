import styles from "./Switch.module.scss";

type Props = {
  value: boolean;
  onClick: () => void | Promise<void>;
};

export const Switch = ({ value, onClick }: Props) => {
  return (
    <button
      className={[styles.container, value && styles.on].join(" ")}
      onClick={onClick}
    >
      <div className={styles.knob} />
    </button>
  );
};
