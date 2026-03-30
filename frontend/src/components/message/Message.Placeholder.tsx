const placeholder = ()=>{
    return (
        <div className={`flex flex-col flex-1 justify-center items-center gap-2 p-8 text-muted-foreground text-center`}>
                <p className="font-medium text-foreground">No conversation selected</p>
                <p className="max-w-sm text-sm">
                  Choose a conversation to start messaging, or select from your care team.
                </p>
              </div>
    )
}

export default placeholder;
