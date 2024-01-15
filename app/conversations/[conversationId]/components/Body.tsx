"use client";

import { FullMessageType } from "@/app/types";
import { useEffect,useRef,useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessage: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessage }) => {
    const [ messages,setMessages ] = useState(initialMessage);
    const buttomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${ conversationId }/seen`);
    },[ conversationId ]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        buttomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${ conversationId }/seen`);

            setMessages((current) => {
                if (find(current,{ id: message.id })) {
                    return current;
                }

                return [ ...current,message ];
            });

            buttomRef?.current?.scrollIntoView();

        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }
                return currentMessage;
            }));
        };
        pusherClient.bind("messages:new",messageHandler);
        pusherClient.bind("message:update",updateMessageHandler);


        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new",messageHandler);
            pusherClient.unbind("message:update",updateMessageHandler);
        };
    },[ conversationId ]);

    return (
        <div className='flex-1 overflow-y-auto'>
            { messages.map((message,i) => (
                <MessageBox
                    isLast={ i === messages.length - 1 }
                    key={ message.id }
                    data={ message }
                />
            )) }
            <div ref={ buttomRef } className='pt-24' />
        </div>
    );
};

export default Body;
