import { ImageIcon } from "lucide-react";

const NoImageIcon = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-md">
      <ImageIcon className="w-8 h-8 text-gray-400" />
    </div>
  );
};

export default NoImageIcon;
