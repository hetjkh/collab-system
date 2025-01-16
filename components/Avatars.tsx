//this is will give a avatars or images of ui ot pic which are on the page it like who is currently online

"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function Avatars() {
    //this is hooks that give by liveblocks
    const others = useOthers();// get the other yser
    const self = useSelf();//get the current user s data

    const all = [self, ...others];

    return (
        <TooltipProvider>
            <div className="flex gap-2 items-center">
                <p className="font-light text-sm">Users currently editing this page:</p>
                <div className="flex -space-x-5">
                    {all.map((other, i) => (
                        <Tooltip key={other?.id + i}>
                            <TooltipTrigger>
                                <Avatar>
                                    <AvatarImage src={other?.info.avatar} />
                                    <AvatarFallback>{other?.info.name}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                {self?.id === other?.id ? "You" : other?.info.name}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}

export default Avatars;
