import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Trash,
  type LucideProps,
} from "lucide-react";

export type ConfirmActionType =
  | "delete"
  | "warning"
  | "info"
  | "success"
  | "default";
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Styling options
  actionType?: ConfirmActionType;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  confirmClassName?: string;
  cancelClassName?: string;
  contentClassName?: string;
  maxWidth?: string;
  // Icon options
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  iconClassName?: string;
  confirmIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  cancelIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  iconSize?: number;
}

/**
 * A `confirm` dialog component built using ShadCN's UI components.
 *
 * This component renders a modal dialog for confirmation purposes.
 * It displays a title, description, and two buttons (Confirm and Cancel).
 * It returns a `Promise<boolean>` that resolves to `true` if the user confirms,
 * or `false` if the user cancels.
 */
export function confirm({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  actionType = "default",
  confirmVariant,
  cancelVariant = "outline",
  confirmClassName,
  cancelClassName,
  contentClassName,
  maxWidth = "lg",
  icon,
  iconClassName,
  confirmIcon,
  cancelIcon,
  iconSize = 20,
}: ConfirmOptions): Promise<boolean> {
  const CancelIcon = cancelIcon;
  const ConfirmIcon = confirmIcon;
  const Icon = icon;
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const getConfirmVariant = ():
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link" => {
      if (confirmVariant) return confirmVariant;

      switch (actionType) {
        case "delete":
          return "destructive";
        case "warning":
          return "destructive";
        case "success":
          return "default";
        case "info":
        case "default":
        default:
          return "default";
      }
    };

    const getConfirmClassNames = (): string => {
      const baseClasses = confirmClassName ?? "";

      if (confirmClassName) return baseClasses;

      switch (actionType) {
        case "delete":
          return "bg-red-500 hover:bg-red-400 text-white";
        case "warning":
          return "bg-amber-500 hover:bg-amber-400 text-white";
        case "success":
          return "bg-green-600 hover:bg-green-500 text-white";
        case "info":
          return "bg-blue-500 hover:bg-blue-400 text-white";
        case "default":
        default:
          return "";
      }
    };

    const getDefaultIcon = () => {
      const DefaultIconComponent =
        {
          delete: Trash,
          warning: AlertTriangle,
          success: CheckCircle,
          info: Info,
          default: HelpCircle,
        }[actionType] ||
        Icon ||
        HelpCircle;

      return <DefaultIconComponent size={iconSize} />;
    };

    const getIconColorClass = (): string => {
      if (iconClassName) return iconClassName;

      switch (actionType) {
        case "delete":
          return "bg-red-100 text-red-500";
        case "warning":
          return "bg-amber-100 text-amber-500";
        case "success":
          return "bg-green-100 text-green-500";
        case "info":
          return "bg-blue-100 text-blue-500";
        case "default":
        default:
          return "bg-gray-100 text-gray-500";
      }
    };

    root.render(
      <AlertDialog open={true} onOpenChange={() => {}}>
        <AlertDialogContent
          className={cn(`max-w-${maxWidth}`, contentClassName)}
        >
          <div className="flex items-start gap-4">
            {(icon ?? actionType) && (
              <div
                className={cn(
                  "p-2 rounded-full flex-shrink-0 mt-6",
                  getIconColorClass(),
                )}
              >
                {getDefaultIcon()}
              </div>
            )}

            <div className="flex-1">
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant={cancelVariant}
                onClick={() => {
                  resolve(false);
                  cleanup();
                }}
                className={cancelClassName}
              >
                {CancelIcon && (
                  <span className="mr-2">
                    <CancelIcon />
                  </span>
                )}
                {cancelLabel}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={getConfirmVariant()}
                onClick={() => {
                  resolve(true);
                  cleanup();
                }}
                className={getConfirmClassNames()}
              >
                {ConfirmIcon && (
                  <span className="mr-2">
                    <ConfirmIcon />
                  </span>
                )}
                {confirmLabel}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
  });
}
