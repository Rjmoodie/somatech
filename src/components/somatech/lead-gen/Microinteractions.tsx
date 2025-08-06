import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Microinteraction variants for consistent animations
export const microVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // Scale animations
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  scaleInHover: {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Slide animations
  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // List animations
  listItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Interactive card component with hover effects
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  onClick,
  selected = false,
  disabled = false
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        "transition-all duration-200 ease-out",
        "hover:shadow-md hover:border-border/60",
        selected && "ring-2 ring-primary/20 border-primary/30 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      whileHover={!disabled ? { 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      onClick={!disabled ? onClick : undefined}
      initial="initial"
      animate="animate"
      variants={microVariants.scaleInHover}
    >
      {children}
    </motion.div>
  );
};

// Animated button component
interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = "default",
  size = "md"
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
      "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
      "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
      "px-3 py-1.5 text-sm": size === "sm",
      "px-4 py-2 text-sm": size === "md",
      "px-6 py-3 text-base": size === "lg",
    },
    className
  );

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.02,
        transition: { duration: 0.1 }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.button>
  );
};

// Animated list component with stagger effects
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      variants={microVariants.staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Animated list item
interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      variants={microVariants.listItem}
    >
      {children}
    </motion.div>
  );
};

// Loading spinner with microinteractions
export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <motion.div
      className={cn("border-2 border-border border-t-primary rounded-full", sizeClasses[size])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Pulse animation for notifications
export const PulseDot: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      className={cn("h-2 w-2 bg-red-500 rounded-full", className)}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

// Smooth transition wrapper
interface SmoothTransitionProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
}

export const SmoothTransition: React.FC<SmoothTransitionProps> = ({ 
  children, 
  className, 
  show = true 
}) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className={className}
          variants={microVariants.fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hover lift effect
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({ 
  children, 
  className, 
  intensity = 4 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -intensity,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        y: -intensity / 2,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  InteractiveCard,
  AnimatedButton,
  AnimatedList,
  AnimatedListItem,
  LoadingSpinner,
  PulseDot,
  SmoothTransition,
  HoverLift,
  microVariants
}; 