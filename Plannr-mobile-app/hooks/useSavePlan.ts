import { savePlan } from "@/lib/queries";
import { useMutation } from "@tanstack/react-query";

export const useSavePlan = () => {
  return useMutation({
    mutationFn: savePlan,
  });
};
