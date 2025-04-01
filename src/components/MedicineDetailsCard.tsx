import React from "react";
import Button from "./Button";

interface MedicineDetailsCardProps {
  medicineDetails: {
    name: string;
    pack_size_label: string;
    price: number;
    image_url: string;
  };
  onAddToCart: () => void;
}

const MedicineDetailsCard: React.FC<MedicineDetailsCardProps> = ({
  medicineDetails,
  onAddToCart,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 space-y-4">
      <img
        src={medicineDetails.image_url}
        alt={medicineDetails.name}
        className="w-full h-40 object-cover rounded-lg border border-gray-300"
      />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          <span className="text-gray-600">Name:</span> {medicineDetails.name}
        </p>
        <p className="text-sm text-gray-800">
          <span className="text-gray-600">Pack Size:</span> {medicineDetails.pack_size_label}
        </p>
        <p className="text-sm text-gray-800">
          <span className="text-gray-600">Price:</span> ₹{medicineDetails.price}
        </p>
      </div>
      <Button
        className="mt-4 w-full bg-primary text-white hover:bg-primary-dark rounded-lg py-2"
        onClick={onAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default MedicineDetailsCard;