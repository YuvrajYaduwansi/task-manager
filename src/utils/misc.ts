export const iconButtonClassName =
  'inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent p-0 text-content hover:bg-line hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'


  
export const cardMotion = {
    initial: { opacity: 0, height: 0, marginTop: 0 },
    animate: { opacity: 1, height: 'auto', marginTop: 8 },
    exit: { opacity: 0, height: 0, marginTop: 0 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  }
  