import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // optional if you use class merging

const steps = [
  { label: "Cart", path: "/cart" },
  { label: "Login/Address", path: "/login" },
  { label: "Payment", path: "/payment" },
];

const CheckoutStepper = () => {
  const location = useLocation();

  const getStepNumber = (stepPath) => {
    const index = steps.findIndex((s) => s.path === stepPath);
    return index + 1;
  };

  const currentIndex = steps.findIndex((s) =>
    location.pathname.startsWith(s.path)
  );

  return (
    <div className="flex justify-center items-center mt-6 mb-10 gap-6 text-sm sm:text-base">
      {steps.map((step, index) => {
        const isActive = currentIndex === index;
        const isCompleted = currentIndex > index;

        return (
          <div key={index} className="flex items-center gap-2">
            <Link
              to={step.path}
              className={cn(
                "flex items-center gap-2",
                isActive ? "text-orange-500 font-bold" : "text-gray-500"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full border-2",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : isCompleted
                    ? "bg-orange-100 border-orange-500 text-orange-500"
                    : "border-gray-400"
                )}
              >
                {getStepNumber(step.path)}
              </div>
              <span>{step.label}</span>
            </Link>

            {index !== steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  isCompleted ? "bg-orange-400" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
