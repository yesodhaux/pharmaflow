
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ArrowRightCircleIcon } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
}

export const FormActions = ({ isSubmitting }: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <CardFooter className="flex justify-between">
      <Button 
        type="button" 
        variant="outline"
        onClick={() => navigate("/dashboard")}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Solicitar Transferência"}
        {!isSubmitting && <ArrowRightCircleIcon className="ml-2 h-4 w-4" />}
      </Button>
    </CardFooter>
  );
};
