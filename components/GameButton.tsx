// "use client";

type GameButtonProps = {
  label: string;
  onClick: () => void;
};

export default function GameButton({ label, onClick }: GameButtonProps) {
  return (
    <button
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-64 transition duration-300 ease-in-out"
      onClick={onClick}>
      {label}
    </button>
  );
}
