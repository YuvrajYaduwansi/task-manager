import { Icon } from "./Icon"
import tickIcon from '../assets/tick.svg'

export function TaskCheckbox({
    checked,
    label,
    disabled = false,
    onChange,
  }: {
    checked: boolean
    label: string
    disabled?: boolean
    onChange: () => void
  }) {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={checked ? `Mark ${label} as not done` : `Mark ${label} as done`}
        disabled={disabled}
        onClick={onChange}
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${
          checked
            ? 'border-accent bg-accent text-white'
            : 'border-line bg-transparent border-2 border-dashed border-white hover:border-accent'
        }`}
      >
        {checked ? <Icon src={tickIcon} /> : null}
      </button>
    )
  }