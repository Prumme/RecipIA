import React from "react";
import Image from "next/image";
import NoImageIcon from "./NoImageIcon";

interface IngredientItemProps {
  name: string;
  quantity: string;
  unit?: string;
  url?: string;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  quantity,
  unit,
  url,
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden max-w-32">
      <div className="aspect-square relative">
        {url ? (
          <Image src={url} alt={name} fill className="object-cover" />
        ) : (
          <NoImageIcon />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate" title={name}>
          {name}
        </h3>
        <p className="text-sm text-gray-600">
          {quantity} {unit}
        </p>
      </div>
    </div>
  );
};

export default IngredientItem;
