type IconProps = {
  src: string
}

export function Icon({ src }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-4 shrink-0 bg-current"
      style={{
        mask: `url("${src}") center / contain no-repeat`,
        WebkitMask: `url("${src}") center / contain no-repeat`,
      }}
    />
  )
}
