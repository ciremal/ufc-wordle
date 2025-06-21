type InfoButtonProps = {
  onClick: () => void;
  label: string;
  color: string;
};

const InfoButton = ({ onClick, label, color }: InfoButtonProps) => {
  return (
    <button
      className={`border py-3 px-6 md:px-10 text-xl hover:brightness-90`}
      onClick={onClick}
      style={{
        background: `${color}`,
      }}
    >
      {label}
    </button>
  );
};

export default InfoButton;
