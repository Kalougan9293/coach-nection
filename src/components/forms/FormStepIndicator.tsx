interface FormStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormStepIndicator({
  currentStep,
  totalSteps,
}: FormStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            index + 1 <= currentStep
              ? "bg-primary w-8"
              : "bg-primary/20 w-2"
          }`}
        />
      ))}
    </div>
  );
}
