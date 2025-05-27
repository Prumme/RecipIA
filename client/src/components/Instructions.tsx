import React from "react";

interface InstructionsProps {
  steps: string[];
}

const Instructions: React.FC<InstructionsProps> = ({ steps }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Instructions</h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <p className="flex-1 pt-1">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Instructions;
