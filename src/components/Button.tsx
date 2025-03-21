import {
  AllHTMLAttributes,
  ElementType,
  MouseEventHandler,
  PropsWithChildren,
} from 'react'
import classNames from 'classnames'

interface PropTypes<T extends HTMLElement>
  extends AllHTMLAttributes<HTMLElement | T> {
  onClick?: MouseEventHandler<HTMLButtonElement>
  asComponent?: ElementType
}

export default function Button<T extends HTMLElement>({
  onClick,
  asComponent,
  children,
  className,
  ...props
}: PropsWithChildren<PropTypes<T>>) {
  const HtmlElement = asComponent || 'button'
  return (
    <HtmlElement
      {...props}
      onClick={onClick || null}
      className={classNames(
        'h-10 w-fit border-gray-500 border-1 rounded-sm mb-1 self-start',
        'cursor-pointer hover:bg-gray-100/50 active:bg-gray-100 transition-colors',
        className,
      )}
    >
      <div className="h-full w-fit py-1 px-4 flex flex-row flex-nowrap items-center space-x-2">
        {children}
      </div>
    </HtmlElement>
  )
}
