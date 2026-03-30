import {X } from "lucide-react";
import type { ReactNode } from "react";

const Footer = ({pendingFile,removePendingFile,children}:{children:ReactNode,pendingFile:File | null,removePendingFile:()=>void})=>{
    return (
         <footer className="--bg-background mb-3 --p-4 --lg:p-6">
                  {pendingFile && (
                    <div className="flex mb-1 md:ml-8 xl:ml-32">
                      <div className="group inline-block relative">
                        <img
                          src={URL.createObjectURL(pendingFile)}
                          alt="Preview"
                          className="shadow-lg rounded-lg w-auto h-32 object-cover"
                        />
                        <button
                          onClick={removePendingFile}
                          className="-top-2 -right-2 absolute bg-destructive hover:bg-destructive/90 shadow-sm p-1 rounded-full text-destructive-foreground hover:scale-110 transition-transform"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {children}
                </footer>
    )
}

export default Footer;
