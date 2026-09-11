import React from "react";
import * as LucideIcons from "lucide-react";

export const Icon = ({ name, size = 20, className = "", color, style = {} }) => {
  // Map icon name to Lucide component
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle || LucideIcons.Tag;
  return <IconComponent size={size} className={className} color={color} style={style} />;
};
