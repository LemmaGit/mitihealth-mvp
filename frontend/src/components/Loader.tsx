import type { ReactNode } from "react";

function Loader({isFullPage=false,children}: {isFullPage?: boolean,children: ReactNode}) {
  return (
    <div className={`flex ${isFullPage ? "h-screen" : "h-full"} items-center justify-center`}>
        {children}
    </div>
  )
}

export default Loader