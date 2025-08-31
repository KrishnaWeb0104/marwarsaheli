import React from "react";
import CheckoutStepper from "@/components/CheckoutStepper";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Stepper Bar */}
      {/* <CheckoutStepper /> */}

      {/* Payment Success Content */}
      <div className="flex flex-col justify-center items-center mt-20 mb-16 text-center">
        {/* Check Icon */}
        <div className="w-35 h-35 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
          <CheckCircle className="text-white w-30 h-30" />
        </div>

        {/* Success Text */}
        <h2 className="text-xl font-semibold mb-6">Payment Successful</h2>

        {/* Button */}
        <Button
          className="bg-[#BD1A12] text-white py-8 px-8 hover:bg-red-700"
          onClick={() => navigate("/account/orders")}
        >
          Go to My orders
        </Button>
      </div>
    </div>
  );
};

export default Payment;
