import { twMerge } from 'tailwind-merge'
import type { ComponentPropsWithRef } from 'react'

const baseClassName =
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md px-4 py-2 font-sans font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60'

const variantClassName = {
  primary:
    'border-2 border-transparent bg-accent-soft text-accent hover:border-accent-border',
  secondary: 'border border-line bg-card text-heading hover:bg-line',
  danger:
    'border-2 border-transparent bg-danger text-white hover:bg-danger-hover',
} as const

export type ButtonVariant = keyof typeof variantClassName

type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  text: string
  variant?: ButtonVariant
}

export function Button({
  text,
  variant = 'primary',
  className,
  type = 'button',
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={twMerge(baseClassName, variantClassName[variant], className)}
      {...props}
    >
      {text}
    </button>
  )
}
