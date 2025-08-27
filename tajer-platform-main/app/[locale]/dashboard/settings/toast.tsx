
import { Alert, AlertDescription } from "@/components/ui/alert";
type ToastProps = {
  message: string;
};

export default function Toast({ message}: ToastProps) {
  return (
  <div className="w-fit">
  <Alert>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
</div>
  );
};