import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString();
}

export function formatPrice(value: number): string {
  return `NT$${value.toFixed(2)}`;
}
